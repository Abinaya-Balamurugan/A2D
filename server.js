const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 5000;
const AI_BACKEND = process.env.AI_BACKEND || "http://127.0.0.1:5001";

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, Date.now() + "_" + safe);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

const products = [
  {id:1,name:"Elegant Blue Kurti",category:"Women",type:"Kurti",color:"Blue",price:1299,brand:"VestiAI Demo Store",sizes:["S","M","L","XL"],image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",garmentType:"upper"},
  {id:2,name:"Classic Black Blazer",category:"Men",type:"Blazer",color:"Black",price:2499,brand:"VestiAI Demo Store",sizes:["M","L","XL","XXL"],image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",garmentType:"upper"},
  {id:3,name:"Pastel Floral Dress",category:"Women",type:"Dress",color:"Pink",price:1899,brand:"VestiAI Demo Store",sizes:["S","M","L"],image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",garmentType:"overall"},
  {id:4,name:"Smart Casual Shirt",category:"Men",type:"Shirt",color:"White",price:1199,brand:"VestiAI Demo Store",sizes:["M","L","XL","XXL"],image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",garmentType:"upper"},
  {id:5,name:"Rose Party Gown",category:"Women",type:"Gown",color:"Rose",price:2999,brand:"VestiAI Demo Store",sizes:["S","M","L"],image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",garmentType:"overall"},
  {id:6,name:"Modern Denim Jacket",category:"Unisex",type:"Jacket",color:"Blue",price:2199,brand:"VestiAI Demo Store",sizes:["M","L","XL"],image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",garmentType:"upper"}
];

app.get("/api/products", (_, res) => res.json(products));

app.get("/api/ai-status", async (_, res) => {
  try {
    const r = await axios.get(`${AI_BACKEND}/health`, { timeout: 2500 });
    res.json({online:true, ...r.data});
  } catch {
    res.json({online:false, message:"Flask AI backend is offline"});
  }
});

app.post("/api/recommend", (req, res) => {
  const { gender, occasion, color, type, budget } = req.body;
  let result = [...products];
  if (gender && gender !== "Any") result = result.filter(p => p.category === gender || p.category === "Unisex");
  if (type && type !== "Any") result = result.filter(p => p.type === type);
  if (color && color !== "Any") result = result.filter(p => p.color.toLowerCase() === color.toLowerCase());
  if (budget) result = result.filter(p => p.price <= Number(budget));
  res.json({success:true, recommendations: result.slice(0,4), occasion: occasion || "Everyday"});
});

/*
  Browser -> Node -> Flask -> CatVTON/Gradio
  The browser sends the person image plus either:
  1) a garment image file, or
  2) a productId whose catalog image is forwarded to Flask as garmentUrl.
*/
app.post("/api/tryon", upload.fields([
  {name:"userImage", maxCount:1},
  {name:"garmentImage", maxCount:1}
]), async (req, res) => {
  try {
    const person = req.files?.userImage?.[0];
    const garment = req.files?.garmentImage?.[0];
    if (!person) return res.status(400).json({success:false,message:"Upload a full-body person image."});

    const product = products.find(p => String(p.id) === String(req.body.productId));
    const form = new FormData();

    form.append("userImage", fs.createReadStream(person.path), {
      filename: person.originalname,
      contentType: person.mimetype
    });

    if (garment) {
      form.append("garmentImage", fs.createReadStream(garment.path), {
        filename: garment.originalname,
        contentType: garment.mimetype
      });
    } else if (product?.image) {
      form.append("garmentUrl", product.image);
    } else {
      return res.status(400).json({success:false,message:"Select a garment or upload a garment image."});
    }

    form.append("dressName", req.body.dressName || product?.name || "");
    form.append("clothType", req.body.clothType || product?.garmentType || "upper");
    form.append("steps", req.body.steps || "50");
    form.append("guidance", req.body.guidance || "2.5");
    form.append("seed", req.body.seed || "42");

    const ai = await axios.post(`${AI_BACKEND}/tryon`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 15 * 60 * 1000
    });

    res.json(ai.data);
  } catch (err) {
    const detail = err.response?.data?.message || err.response?.data?.error || err.message;
    res.status(502).json({
      success:false,
      message:"Could not connect to the Flask/CatVTON backend.",
      detail
    });
  }
});

app.get("*", (_, res) => res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT, () => console.log(`VestiAI website: http://localhost:${PORT}`));
