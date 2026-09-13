require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

// ==========================================
// MONGODB
// ==========================================

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/otp", otpRoutes);

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AI Virtual Dressing Room Backend Running Successfully 🚀"
    });

});

// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });

});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `✅ Server Running on http://localhost:${PORT}`
    );

});