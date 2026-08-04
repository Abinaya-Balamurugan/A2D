const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "AI Virtual Dressing Room - Password Reset OTP",
        html: `
            <h2>Password Reset Request</h2>

            <p>Your OTP is:</p>

            <h1 style="color:#163b84;">${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>

            <p>Do not share it with anyone.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;