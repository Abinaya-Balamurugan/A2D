import os
import uuid
import shutil
import tempfile
from pathlib import Path

import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image

try:
    from gradio_client import Client
except ImportError:
    Client = None

APP_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = APP_DIR / "uploads"
OUTPUT_DIR = APP_DIR / "outputs"
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

CATVTON_URL = os.getenv("CATVTON_URL", "http://127.0.0.1:7860")
PORT = int(os.getenv("PORT", "5001"))

app = Flask(__name__)
CORS(app)

_client = None

def get_client():
    global _client
    if Client is None:
        raise RuntimeError("gradio_client is not installed. Run: pip install -r requirements.txt")
    if _client is None:
        _client = Client(CATVTON_URL)
    return _client

def download_image(url: str, destination: Path):
    r = requests.get(url, timeout=30, stream=True)
    r.raise_for_status()
    with open(destination, "wb") as f:
        for chunk in r.iter_content(1024 * 64):
            if chunk:
                f.write(chunk)

def make_editor_data(image_path: str):
    # CatVTON's Gradio UI uses an ImageEditor for the Person Image.
    return {
        "background": {
            "path": image_path,
            "url": None,
            "size": os.path.getsize(image_path),
            "orig_name": os.path.basename(image_path),
            "mime_type": "image/png",
            "is_stream": False,
            "meta": {"_type": "gradio.FileData"}
        },
        "layers": [],
        "composite": {
            "path": image_path,
            "url": None,
            "size": os.path.getsize(image_path),
            "orig_name": os.path.basename(image_path),
            "mime_type": "image/png",
            "is_stream": False,
            "meta": {"_type": "gradio.FileData"}
        },
        "id": None
    }

def normalize_result(result):
    # CatVTON's submit_function returns a Gradio FileData-like image object.
    if isinstance(result, dict):
        p = result.get("path")
        if p and os.path.exists(p):
            out_name = f"{uuid.uuid4().hex}.png"
            out_path = OUTPUT_DIR / out_name
            shutil.copy2(p, out_path)
            return f"/output/{out_name}"
        u = result.get("url")
        if u:
            return u

    if isinstance(result, str):
        if os.path.exists(result):
            out_name = f"{uuid.uuid4().hex}.png"
            out_path = OUTPUT_DIR / out_name
            shutil.copy2(result, out_path)
            return f"/output/{out_name}"
        if result.startswith("http"):
            return result

    if isinstance(result, (list, tuple)) and result:
        return normalize_result(result[0])

    raise RuntimeError(f"CatVTON returned an unexpected result: {type(result).__name__}")

@app.get("/health")
def health():
    return jsonify({
        "online": True,
        "service": "Flask CatVTON Bridge",
        "catvton_url": CATVTON_URL,
        "endpoint": "/tryon",
        "catvton_api": "/submit_function"
    })

@app.post("/tryon")
def tryon():
    person_file = request.files.get("userImage")
    garment_file = request.files.get("garmentImage")
    garment_url = request.form.get("garmentUrl", "").strip()

    if not person_file:
        return jsonify(success=False, message="userImage is required"), 400

    job_dir = Path(tempfile.mkdtemp(prefix="vestiai_"))
    try:
        person_path = job_dir / "person.png"
        person_file.save(person_path)

        garment_path = job_dir / "garment.png"
        if garment_file:
            garment_file.save(garment_path)
        elif garment_url:
            download_image(garment_url, garment_path)
        else:
            return jsonify(success=False, message="garmentImage or garmentUrl is required"), 400

        # Re-save as RGB PNG for predictable Gradio/CatVTON input.
        Image.open(person_path).convert("RGB").save(person_path)
        Image.open(garment_path).convert("RGB").save(garment_path)

        cloth_type = request.form.get("clothType", "upper")
        steps = float(request.form.get("steps", "50"))
        guidance = float(request.form.get("guidance", "2.5"))
        seed = float(request.form.get("seed", "42"))

        client = get_client()

        # Exact CatVTON Gradio endpoint discovered from the user's running app:
        # /submit_function
        # Inputs:
        # 1 person_image (ImageEditor)
        # 2 cloth_image (Image)
        # 3 cloth_type: upper/lower/overall
        # 4 num_inference_steps
        # 5 guidance_scale
        # 6 seed
        # 7 show_type
        result = client.predict(
            make_editor_data(str(person_path)),
            str(garment_path),
            cloth_type,
            steps,
            guidance,
            seed,
            "result only",
            api_name="/submit_function"
        )

        output_url = normalize_result(result)
        return jsonify(
            success=True,
            message="CatVTON virtual try-on completed.",
            resultUrl=output_url,
            dressName=request.form.get("dressName", ""),
            clothType=cloth_type
        )

    except Exception as exc:
        return jsonify(
            success=False,
            message="CatVTON inference failed.",
            detail=str(exc),
            catvton_url=CATVTON_URL,
            hint="Make sure the CatVTON Gradio app is running on port 7860 and exposes /submit_function."
        ), 500
    finally:
        shutil.rmtree(job_dir, ignore_errors=True)

@app.get("/output/<path:name>")
def output(name):
    return send_from_directory(OUTPUT_DIR, name)

if __name__ == "__main__":
    print(f"Flask AI bridge running on http://127.0.0.1:{PORT}")
    print(f"Connecting to CatVTON at {CATVTON_URL}")
    app.run(host="127.0.0.1", port=PORT, debug=False)
