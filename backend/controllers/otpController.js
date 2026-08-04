const OTP = require("../models/OTP");
const User = require("../models/User");
const sendOTP = require("../utils/sendEmail");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");

// ============================
// Send OTP
// ============================

exports.sendOTP = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered."
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        await OTP.deleteMany({ email });

        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOTP(email, otp);

        res.json({
            success: true,
            message: "OTP sent successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ============================
// Verify OTP
// ============================

exports.verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const otpData = await OTP.findOne({ email });

        if (!otpData) {

            return res.status(400).json({
                success: false,
                message: "OTP not found."
            });

        }

        if (otpData.expiresAt < new Date()) {

            return res.status(400).json({
                success: false,
                message: "OTP expired."
            });

        }

        if (otpData.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });

        }

        res.json({
            success: true,
            message: "OTP Verified"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ============================
// Reset Password
// ============================

exports.resetPassword = async (req, res) => {

    try {

        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword
            }
        );

        await OTP.deleteMany({ email });

        res.json({
            success: true,
            message: "Password Updated Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};