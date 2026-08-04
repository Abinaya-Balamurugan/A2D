const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =============================
// REGISTER
// =============================
exports.register = async (req, res) => {

    console.log("========== REGISTER REQUEST ==========");
    console.log("Request Body:", req.body);

    try {

        const { name, email, phone, password } = req.body;

        // Validate input
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });

        // Save user
        await user.save();

        console.log("User Registered Successfully");

        return res.status(201).json({
            success: true,
            message: "Registration Successful"
        });

    } catch (err) {

        console.error("REGISTER ERROR");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// =============================
// LOGIN
// =============================
exports.login = async (req, res) => {

    console.log("========== LOGIN REQUEST ==========");
    console.log("Request Body:", req.body);

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });

        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        console.log("Login Successful");

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (err) {

        console.error("LOGIN ERROR");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};