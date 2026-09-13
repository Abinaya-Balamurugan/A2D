from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import os
import uuid
from PIL import Image
from gradio_client import Client, handle_file


# =========================================================
# FLASK
# =========================================================

app = Flask(__name__)
CORS(app)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
TEMP_FOLDER = os.path.join(BASE_DIR, "temp")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)


# =========================================================
# CATVTON
# =========================================================

CATVTON_URL = "http://127.0.0.1:7860"

print()
print("==========================================")
print("        CONNECTING TO CATVTON")
print("==========================================")

try:

    client = Client(CATVTON_URL)

    print("Loaded as API:", CATVTON_URL, "✔")
    print("✅ CatVTON connected successfully")

except Exception as e:

    client = None

    print("❌ CatVTON connection failed")
    print("ERROR:", str(e))


# =========================================================
# ALLOWED FILES
# =========================================================

ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp"
}


def allowed_file(filename):

    return (
        "." in filename
        and
        filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =========================================================
# CONVERT IMAGE TO RGB JPEG
# =========================================================

def convert_to_rgb_jpeg(input_path, output_path):

    print()
    print("Converting image to RGB...")

    image = Image.open(input_path)

    print("Original mode:", image.mode)

    # IMPORTANT
    # Remove transparency / alpha channel
    if image.mode in ("RGBA", "LA", "P"):

        if image.mode == "P":

            image = image.convert("RGBA")

        background = Image.new(
            "RGB",
            image.size,
            (255, 255, 255)
        )

        if image.mode in ("RGBA", "LA"):

            if image.mode == "LA":

                image = image.convert("RGBA")

            background.paste(
                image,
                mask=image.getchannel("A")
            )

            image = background

        else:

            image = image.convert("RGB")

    else:

        image = image.convert("RGB")


    print("Final mode:", image.mode)

    image.save(
        output_path,
        format="JPEG",
        quality=95
    )

    print("RGB JPEG created:")
    print(output_path)

    return output_path


# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "message":
        "AI Virtual Try-On Flask Server Running 🚀",

        "server":
        "http://127.0.0.1:5001",

        "catvton":
        "http://127.0.0.1:7860"

    })


# =========================================================
# TRY ON
# =========================================================

@app.route("/tryon", methods=["POST"])
def tryon():

    try:

        print()
        print("==========================================")
        print("        NEW TRY-ON REQUEST")
        print("==========================================")


        # =================================================
        # CHECK CATVTON
        # =================================================

        if client is None:

            return jsonify({

                "success": False,

                "message":
                "CatVTON is not connected."

            }), 500


        # =================================================
        # USER IMAGE
        # =================================================

        if "userImage" not in request.files:

            return jsonify({

                "success": False,

                "message":
                "User image is required."

            }), 400


        user_file = request.files["userImage"]


        if user_file.filename == "":

            return jsonify({

                "success": False,

                "message":
                "No user image selected."

            }), 400


        if not allowed_file(user_file.filename):

            return jsonify({

                "success": False,

                "message":
                "Invalid user image format."

            }), 400


        # =================================================
        # DRESS IMAGE
        # =================================================

        if "dressImage" not in request.files:

            return jsonify({

                "success": False,

                "message":
                "Dress image is required."

            }), 400


        dress_file = request.files["dressImage"]


        if dress_file.filename == "":

            return jsonify({

                "success": False,

                "message":
                "No dress image selected."

            }), 400


        if not allowed_file(dress_file.filename):

            return jsonify({

                "success": False,

                "message":
                "Invalid dress image format."

            }), 400


        # =================================================
        # UNIQUE ID
        # =================================================

        unique_id = str(uuid.uuid4())


        # =================================================
        # SAVE ORIGINAL USER IMAGE
        # =================================================

        user_original = os.path.join(
            UPLOAD_FOLDER,
            "user_" + unique_id + ".png"
        )

        user_file.save(user_original)

        print("User image:")
        print(user_original)


        # =================================================
        # SAVE ORIGINAL DRESS
        # =================================================

        dress_original = os.path.join(
            UPLOAD_FOLDER,
            "dress_" + unique_id + ".png"
        )

        dress_file.save(dress_original)

        print("Dress image:")
        print(dress_original)


        # =================================================
        # CONVERT USER TO RGB JPEG
        # =================================================

        user_rgb = os.path.join(
            TEMP_FOLDER,
            "user_" + unique_id + ".jpg"
        )

        convert_to_rgb_jpeg(
            user_original,
            user_rgb
        )


        # =================================================
        # CONVERT DRESS TO RGB JPEG
        # =================================================

        dress_rgb = os.path.join(
            TEMP_FOLDER,
            "dress_" + unique_id + ".jpg"
        )

        convert_to_rgb_jpeg(
            dress_original,
            dress_rgb
        )


        print()
        print("==========================================")
        print("RGB FILES READY")
        print("==========================================")

        print("Person:")
        print(user_rgb)

        print()

        print("Dress:")
        print(dress_rgb)


        # =================================================
        # CATVTON API
        # =================================================

        print()
        print("==========================================")
        print("        SENDING TO CATVTON")
        print("==========================================")


        # -------------------------------------------------
        # IMPORTANT:
        #
        # CatVTON expects ImageEditor data for person_image
        #
        # We first use person_example_fn to convert
        # the normal image into the required editor format.
        # -------------------------------------------------

        print()
        print("Preparing person image...")


        person_data = client.predict(
            handle_file(user_rgb),
            api_name="/person_example_fn"
        )


        print("Person image prepared ✔")


        # =================================================
        # CALL CATVTON
        # =================================================

        print()
        print("Running CatVTON...")
        print("This may take some time...")
        print()


        result = client.predict(

            person_data,

            handle_file(dress_rgb),

            "upper",

            50,

            2.5,

            42,

            "result only",

            api_name="/submit_function"

        )


        print()
        print("==========================================")
        print("        CATVTON COMPLETED")
        print("==========================================")


        print("Raw result:")
        print(result)


        # =================================================
        # GET RESULT PATH
        # =================================================

        result_path = None


        if isinstance(result, dict):

            result_path = result.get("path")


        elif isinstance(result, str):

            result_path = result


        # Some Gradio results may return a tuple/list
        elif isinstance(result, (list, tuple)):

            if len(result) > 0:

                first = result[0]

                if isinstance(first, dict):

                    result_path = first.get("path")

                elif isinstance(first, str):

                    result_path = first


        # =================================================
        # CHECK RESULT
        # =================================================

        if not result_path:

            print("❌ Could not find result path.")

            return jsonify({

                "success": False,

                "message":
                "CatVTON completed but no result image was returned.",

                "raw_result":
                str(result)

            }), 500


        print()
        print("CatVTON result:")
        print(result_path)


        # =================================================
        # COPY RESULT TO OUTPUT
        # =================================================

        final_filename = (
            "result_"
            + unique_id
            + ".png"
        )

        final_path = os.path.join(
            OUTPUT_FOLDER,
            final_filename
        )


        result_image = Image.open(result_path)


        # Make sure output is valid RGB/RGBA
        if result_image.mode not in ("RGB", "RGBA"):

            result_image = result_image.convert("RGB")


        result_image.save(
            final_path,
            format="PNG"
        )


        print()
        print("Final result saved:")
        print(final_path)


        # =================================================
        # RESULT URL
        # =================================================

        result_url = (
            "http://127.0.0.1:5001/output/"
            + final_filename
        )


        print()
        print("RESULT URL:")
        print(result_url)

        print()
        print("==========================================")
        print("        TRY-ON SUCCESS")
        print("==========================================")


        return jsonify({

            "success": True,

            "message":
            "AI Try-On generated successfully!",

            "image":
            result_url

        })


    except Exception as e:

        print()
        print("==========================================")
        print("        TRY-ON ERROR")
        print("==========================================")

        print(type(e).__name__)
        print(str(e))

        import traceback

        traceback.print_exc()


        return jsonify({

            "success": False,

            "message":
            str(e)

        }), 500


# =========================================================
# SERVE OUTPUT
# =========================================================

@app.route(
    "/output/<filename>",
    methods=["GET"]
)
def output_file(filename):

    return send_from_directory(
        OUTPUT_FOLDER,
        filename
    )


# =========================================================
# START FLASK
# =========================================================

if __name__ == "__main__":

    print()
    print("==========================================")
    print("🚀 AI VIRTUAL TRY-ON FLASK SERVER")
    print("==========================================")

    print()
    print("Flask:")
    print("http://127.0.0.1:5001")

    print()
    print("CatVTON:")
    print("http://127.0.0.1:7860")

    print()
    print("==========================================")


    app.run(
        host="0.0.0.0",
        port=5001,
        debug=False
    )