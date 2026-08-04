const express = require("express");

const router = express.Router();

const otp = require("../controllers/otpController");

router.post("/forgot-password", otp.sendOTP);

router.post("/verify-otp", otp.verifyOTP);

router.post("/reset-password", otp.resetPassword);

module.exports = router;