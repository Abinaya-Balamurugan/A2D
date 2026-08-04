from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import os
import shutil
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return {
        "success": True,
        "message": "AI Server Running"
    }


@app.route("/tryon", methods=["POST"])
def tryon():

    if "userImage" not in request.files:

        return jsonify({

            "success":False,

            "message":"User Image Missing"

        })

    user_image=request.files["userImage"]

    dress_name=request.form["dressName"]

    filename=str(uuid.uuid4())+".jpg"

    upload_path=os.path.join(UPLOAD_FOLDER,filename)

    output_path=os.path.join(OUTPUT_FOLDER,filename)

    user_image.save(upload_path)

    # ===============================
    # PLACEHOLDER
    # Replace this with IDM-VTON later
    # ===============================

    shutil.copy(upload_path,output_path)

    return jsonify({

        "success":True,

        "image":"http://127.0.0.1:5001/output/"+filename

    })

@app.route("/output/<filename>")
def output(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)


if __name__ == "__main__":
    app.run(port=5001, debug=True)