# VestiAI — AI Virtual Dress Recommendation + Real CatVTON Try-On

This project connects the website to the **CatVTON Gradio application you already have running locally**.

## Architecture

```text
Browser
   │
   ▼
Node.js + Express (http://127.0.0.1:5000)
   │
   │ POST /api/tryon
   ▼
Flask AI Bridge (http://127.0.0.1:5001)
   │
   │ gradio_client
   ▼
CatVTON Gradio (http://127.0.0.1:7860)
   │
   │ /submit_function
   ▼
Generated Virtual Try-On Image
   │
   ▼
Website Result
```

Your saved CatVTON Gradio configuration exposes the endpoint `/submit_function`.
Its inputs are:
1. Person Image
2. Condition Image
3. Try-On Cloth Type: `upper`, `lower`, `overall`
4. Inference Step
5. CFG Strength
6. Seed
7. Show Type

The Flask bridge calls that endpoint with `show_type="result only"`.

## Folder structure

```text
AI_Virtual_Dress_Recommendation_CatVTON/
├── server.js
├── package.json
├── .env.example
├── start-all.bat
├── start-ai-bridge.bat
├── start-website.bat
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── uploads/
└── ai/
    └── backend/
        ├── app.py
        ├── requirements.txt
        ├── uploads/
        └── outputs/
```

## Important: Start your existing CatVTON first

You already had CatVTON responding on:

```text
http://127.0.0.1:7860
```

Start it exactly as you currently do and confirm that this opens in the browser.

The Flask bridge does NOT replace CatVTON. It connects your website to the CatVTON process.

## 1. Install Node packages

Open a terminal in this project folder:

```powershell
npm install
```

## 2. Install Flask bridge packages

Your previous AI environment used Python 3.9.13, so activate that environment.

If your environment is in the project parent folder:

```powershell
..\vton-env\Scripts\activate
```

Then:

```powershell
cd ai\backend
pip install -r requirements.txt
```

If `gradio_client` is already installed, pip will keep the existing compatible package.

## 3. Start the Flask bridge

From:

```text
ai\backend
```

run:

```powershell
python app.py
```

You should see:

```text
Flask AI bridge running on http://127.0.0.1:5001
Connecting to CatVTON at http://127.0.0.1:7860
```

Test:

```powershell
curl http://127.0.0.1:5001/health
```

## 4. Start the website

Open another terminal in the project root:

```powershell
npm start
```

Open:

```text
http://localhost:5000
```

## 5. Use Virtual Try-On

1. Scroll to Virtual Try-On.
2. Upload a clear full-body image.
3. Select a product.
4. Optionally upload the exact garment image.
5. Select Upper / Lower / Overall.
6. Click **Generate Real CatVTON Try-On**.
7. Wait for CatVTON inference.
8. The generated image will appear in the result card.

## Exact backend flow

The browser sends:

```text
POST http://localhost:5000/api/tryon
```

Node forwards the files to:

```text
POST http://127.0.0.1:5001/tryon
```

Flask calls:

```text
CatVTON: /submit_function
```

Then the result is returned to the browser.

## If you get "CatVTON offline"

Check these three terminals/processes:

```text
CatVTON          → 127.0.0.1:7860
Flask bridge     → 127.0.0.1:5001
Website          → 127.0.0.1:5000
```

Test:

```powershell
curl http://127.0.0.1:7860/
curl http://127.0.0.1:5001/health
curl http://127.0.0.1:5000/api/ai-status
```

## If CatVTON says an input is invalid

CatVTON's Person Image input is an ImageEditor. The bridge intentionally sends an ImageEditor-compatible object with `background`, `layers`, and `composite`.

The garment is sent as the Condition Image.

For the cloth type use only:

```text
upper
lower
overall
```

## Product images

The demo catalog currently uses remote sample fashion images. For the final college/SIH version, replace the catalog image URLs in `server.js` with your actual retailer/product images.

The website also lets you upload an exact garment image. That is the most reliable option for a real CatVTON demonstration.

## Your existing AI environment

This integration is designed around the environment you previously used:

- Python 3.9.13
- PyTorch 2.8.0+cu126
- CUDA available
- NVIDIA RTX 3050 6GB Laptop GPU
- CatVTON running through Gradio on port 7860

## Note about CatVTON

CatVTON's saved Gradio page indicates its demo/weights are for non-commercial use. For a college/SIH prototype, check the model's current license and usage terms before commercial deployment.
