const express = require("express");

const router = express.Router();

const User = require("../models/User");

const OTP = require("../models/OTP");

const sendOTPEmail =
    require("../utils/sendEmail");


// ==========================================
// SEND EMAIL OTP
// ==========================================

router.post(
    "/send-email-otp",
    async (req, res) => {

        try {

            const { email } = req.body;

            if (!email) {

                return res.status(400).json({

                    success: false,

                    message: "Email is required"

                });

            }

            // Find registered user
            const user =
                await User.findOne({ email });

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "No account found with this email"

                });

            }

            // Generate 6 digit OTP
            const otp =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ).toString();

            // OTP valid for 5 minutes
            const expiresAt =
                new Date(
                    Date.now() + 5 * 60 * 1000
                );

            // Delete old OTP
            await OTP.deleteMany({
                email
            });

            // Save OTP
            await OTP.create({

                email,

                otp,

                expiresAt

            });

            // Send email
            await sendOTPEmail(
                email,
                otp
            );

            return res.status(200).json({

                success: true,

                message:
                    "OTP sent successfully to your email"

            });

        }

        catch (error) {

            console.error(
                "Send OTP Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message: "Failed to send OTP"

            });

        }

    }
);


// ==========================================
// VERIFY EMAIL OTP
// ==========================================

router.post(
    "/verify-email-otp",
    async (req, res) => {

        try {

            const { email, otp } = req.body;

            if (!email || !otp) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and OTP are required"

                });

            }

            // Find OTP
            const savedOTP =
                await OTP.findOne({

                    email,
                    otp

                });

            if (!savedOTP) {

                return res.status(400).json({

                    success: false,

                    message: "Invalid OTP"

                });

            }

            // Check expiration
            if (
                savedOTP.expiresAt <
                new Date()
            ) {

                await OTP.deleteOne({

                    _id: savedOTP._id

                });

                return res.status(400).json({

                    success: false,

                    message: "OTP expired"

                });

            }

            // Delete used OTP
            await OTP.deleteOne({

                _id: savedOTP._id

            });

            return res.status(200).json({

                success: true,

                message:
                    "OTP verified successfully"

            });

        }

        catch (error) {

            console.error(
                "Verify OTP Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "OTP verification failed"

            });

        }

    }
);


module.exports = router;