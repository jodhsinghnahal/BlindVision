from flask import Flask, render_template, request, jsonify, session, redirect
from ultralytics import YOLO
import base64
import io
from PIL import Image
import cv2
import torch
import google.generativeai as genai
import os
import PIL.Image
from gtts import gTTS
from flask_session import Session
import sqlite3
import string

letters_a_to_z = list(string.ascii_lowercase)

gemini_api_key = os.environ["GOOGLE_API_KEY"]
genai.configure(api_key = gemini_api_key)

app = Flask(__name__)

DATABASE = 'logins.db'

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def main():
    print(session.get("username"))
    if not session.get("username"):
        return redirect("/login")
    return render_template("camera.html", letters= letters_a_to_z)

def connect_db():
    return sqlite3.connect(DATABASE)

@app.route("/logout")
def logout():
    session["username"] = None
    return redirect("/")

@app.route("/signup", methods=["POST", "GET"])
def signup():
    db = connect_db()
    cursor = db.cursor()
    print(request.form.get("username"))
    count = cursor.execute("SELECT COUNT(*) FROM users WHERE username = ?", (request.form.get("username"),)).fetchone()[0]
    db.close()
    if(count > 0):
        right="Username already taken"
        return render_template("login.html", right=right, letters=letters_a_to_z)
    db = connect_db()
    cursor = db.cursor()
    print(request.form.get("username"))
    if (not request.form.get("username")) or (not request.form.get("password")):
        db.close()
        right = "Retry"
        return render_template("login.html", right=right, letters=letters_a_to_z)
    
    cursor.execute("INSERT INTO users (username, password) VALUES(?, ?)", (request.form.get("username"),request.form.get("password")))
    db.commit()
    db.close()
    session["username"] = request.form.get("username")

    return redirect('/')

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        db = connect_db()
        cursor = db.cursor()
        print("Username is", request.form.get("username"))
        if (not request.form.get("username")) or (not request.form.get("password")):
            db.close()
            right = "Retry"
            return render_template("login.html", right=right, letters=letters_a_to_z)
        password = cursor.execute("SELECT password FROM users WHERE username = ?", (request.form.get("username"),)).fetchone()
        if not password:
            right = "Incorrect"
            return render_template("login.html", right=right, letters=letters_a_to_z)
        password = password[0]
        db.close()
        print(password)
        if(password != request.form.get("password")):
            right = "Incorrect"
            return render_template("login.html", right=right, letters=letters_a_to_z)
        session["username"] = request.form.get("username")
        return redirect("/")
    return render_template("login.html", letters=letters_a_to_z)

@app.route("/upload_image", methods=["POST"])
def image():
    data = request.json

    # Extract the base64-encoded image data
    image_data = data.get("image", "")
    text = data['text']

    # Remove the "data:image/jpeg;base64," prefix
    _, encoded_image = image_data.split(",", 1)

    # Decode the base64-encoded image data
    image_bytes = base64.b64decode(encoded_image)

    # Convert the image bytes to a PIL Image
    image = Image.open(io.BytesIO(image_bytes))

    # Save the image to a file
    image.save("uploaded_image.jpg")

    # print(2)

    # # Load YOLOv7 model
    # # model = torch.hub.load('/yolov7.pt', 'yolov7')
    # # model = YOLO("yolov7/models/yolo.py")
    # model = YOLO("yolov7m.pt")

    # print(3)

    # # Load the saved image
    # image = cv2.imread('uploaded_image.jpg')

    # print(4)

    # # Perform object detection
    # results = model(image)

    # print(5)

    # # Process detection results
    # detected_objects = results.pred[0]  # Extract detected objects
    # for obj in detected_objects:
    #     print(6)
    #     label = obj.get_field('names')[0]  # Get label
    #     confidence = obj.get_field('scores')[0]  # Get confidence score
    #     box = obj.bbox.int().tolist()  # Get bounding box coordinates
    #     cv2.rectangle(image, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
    #     cv2.putText(image, f'{label}: {confidence:.2f}', (box[0], box[1] - 10),
    #                 cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # # Display the result
    # cv2.imshow('Object Detection', image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    img = PIL.Image.open('uploaded_image.jpg')

    model = genai.GenerativeModel('gemini-pro-vision')

    print("hello", text)
    try:
        response = model.generate_content([text, img], stream=True)
        response.resolve()
        print("done", text)

        return jsonify({'message': response.text})
    except:
        return jsonify({'message': 'error'})

@app.route("/chat", methods=['POST', 'GET'])
def chat():
    if request.method == 'POST':
        data = request.json

        model = genai.GenerativeModel('gemini-pro')

        db = connect_db()
        cursor = db.cursor()
        #parts = model message, role=user messsage
        hist = cursor.execute("SELECT DISTINCT parts, role FROM user_data JOIN users ON ((SELECT id FROM users where username = ?) = user_data.user_id) ORDER BY user_data.id ASC LIMIT 10", (session["username"],)).fetchall()
        db.close()
        print(hist)
        # history = [{'parts': [parts], 'role': role} for parts, role in hist]
        history_=[]
        for mes in hist:
            print(mes[1])
            print(mes[0])
            history_.append({'parts': mes[1], 'role': 'user'})
            history_.append({'parts': mes[0], 'role': 'model'}) 
        # Start the chat with the updated history
        
        try:
            aichat = model.start_chat(history=history_)

            response = aichat.send_message(data.get("text"))

            # for mes in aichat.history:
            #     print(mes)
            # print(aichat.history)

            db = connect_db()
            cursor = db.cursor()
            parts = response.text;
            role = data.get("text")
            print(parts)
            print(role)
            cursor.execute("INSERT INTO user_data (user_id, parts, role) VALUES ((SELECT id from users where username = ?), ?, ?)", (session["username"],parts, role))
            db.commit()
            db.close()

            return jsonify({'message': response.text})
        except:
            return jsonify({'message': 'error'})

    else:
        return render_template("chat.html", letters=letters_a_to_z)
    
@app.route("/hist")
def hist():
    if(not 'username' in session):
        return redirect('/')
    
    db = connect_db()
    cursor = db.cursor()
    #parts = model message, role=user messsage
    hist = cursor.execute("SELECT DISTINCT parts, role FROM user_data JOIN users ON ((SELECT id FROM users where username = ?) = user_data.user_id) ORDER BY user_data.id ASC", (session["username"],)).fetchall()
    db.close()        
    
    return render_template("chatHist.html", chat_history=hist)

if __name__ == "__main__":
    app.run(port=4000, debug=True, threaded=True)
