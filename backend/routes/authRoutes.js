const express = require("express");

const router = express.Router();

const {
    register,
    login,
    resetPassword
} = require("../controllers/authController");


// ==========================================
// REGISTER
// ==========================================

router.post("/register", register);


// ==========================================
// LOGIN
// ==========================================

router.post("/login", login);


// ==========================================
// RESET PASSWORD
// ==========================================

router.post("/reset-password", resetPassword);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;