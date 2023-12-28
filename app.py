from flask import Flask, render_template, request, jsonify
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

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("camera.html")

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

    gemini_api_key = os.environ["GOOGLE_API_KEY"]
    genai.configure(api_key = gemini_api_key)

    img = PIL.Image.open('uploaded_image.jpg')

    model = genai.GenerativeModel('gemini-pro-vision')

    print(text)
    response = model.generate_content([text, img], stream=True)
    response.resolve()

    return jsonify({'message': response.text})

@app.route("/chat", methods=['POST', 'GET'])
def chat():
    if request.method == 'POST':
        gemini_api_key = os.environ["GOOGLE_API_KEY"]
        genai.configure(api_key = gemini_api_key)

        model = genai.GenerativeModel('gemini-pro')
        chat = model.start_chat(history=[])

        response = chat.send_message(request.args.get('mesg'))

        print(response.text)

        response = chat.send_message("what did i just ask.")
        print("done")

        print(response.text)

    return render_template("chat.html")


if __name__ == "__main__":
    app.run(port=4000, debug=True, threaded=True)
