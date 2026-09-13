const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;

        // Check fields
        if (!name || !email || !phone || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });

        }

        // Check existing email
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });

        }

        // Check existing phone
        const existingPhone = await User.findOne({ phone });

        if (existingPhone) {

            return res.status(400).json({
                success: false,
                message: "Phone number already registered"
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({

            name,
            email,
            phone,
            password: hashedPassword

        });

        return res.status(201).json({

            success: true,

            message: "Account created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }

        });

    }

    catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({

            success: false,

            message: "Server error during registration"

        });

    }

};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"

            });

        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(password, user.password);

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }

        // Create JWT
        const token = jwt.sign(

            {
                id: user._id,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        return res.status(200).json({

            success: true,

            message: "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone

            }

        });

    }

    catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({

            success: false,

            message: "Server error during login"

        });

    }

};


// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and new password are required"

            });

        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Password reset successfully"

        });

    }

    catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server error while resetting password"

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    register,
    login,
    resetPassword

};