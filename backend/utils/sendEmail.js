const nodemailer = require("nodemailer");


// ==========================================
// GMAIL TRANSPORTER
// ==========================================

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASS

        }

    });


// ==========================================
// SEND OTP EMAIL
// ==========================================

const sendOTPEmail = async (
    email,
    otp
) => {

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: email,

        subject:
            "AI Virtual Dressing Room - Password Reset OTP",

        text:
            `Your password reset OTP is ${otp}. ` +
            `This OTP is valid for 5 minutes.`

    };

    await transporter.sendMail(
        mailOptions
    );

};


module.exports =
    sendOTPEmail;