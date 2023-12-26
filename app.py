from flask import Flask, redirect, render_template, request, jsonify
from OpenSSL import SSL
import base64
import io
from PIL import Image

app = Flask(__name__)


@app.route("/")
def main():
    return render_template("camera.html")


@app.route("/upload_image", methods=["POST"])
def image():
    data = request.json
    print(data)

    return jsonify({'message': 'Image saved successfully'})

if __name__ == "__main__":
    app.run(port=4000)
