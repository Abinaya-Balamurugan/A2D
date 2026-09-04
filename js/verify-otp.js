// ==========================================
// VERIFY OTP PAGE
// AI Virtual Dressing Room
// ==========================================


// ==========================================
// OTP INPUTS
// ==========================================

const otpInputs =
    document.querySelectorAll(".otp");


// ==========================================
// AUTO MOVE TO NEXT BOX
// ==========================================

otpInputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        // Allow only numbers
        input.value =
            input.value.replace(/[^0-9]/g, "");


        if (
            input.value.length === 1 &&
            index < otpInputs.length - 1
        ) {

            otpInputs[index + 1].focus();

        }

    });


    // ======================================
    // BACKSPACE
    // ======================================

    input.addEventListener("keydown", (e) => {

        if (
            e.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {

            otpInputs[index - 1].focus();

        }

    });

});


// ==========================================
// COUNTDOWN
// ==========================================

let seconds = 60;

const countdown =
    document.getElementById("countdown");

const resendBtn =
    document.getElementById("resendBtn");


const timer = setInterval(() => {

    seconds--;

    countdown.innerHTML =
        `Resend OTP in ${seconds}s`;


    if (seconds <= 0) {

        clearInterval(timer);

        countdown.innerHTML =
            "Didn't receive OTP?";

        resendBtn.disabled = false;

    }

}, 1000);


// ==========================================
// VERIFY OTP
// ==========================================

document
    .getElementById("verifyBtn")
    .addEventListener("click", async () => {


        // Get email
        const email =
            localStorage.getItem("resetEmail");


        // Check email
        if (!email) {

            alert(
                "Email not found. Please request OTP again."
            );

            window.location.href =
                "forgot-password.html";

            return;

        }


        // Build OTP
        let otp = "";

        otpInputs.forEach((box) => {

            otp += box.value;

        });


        // Check OTP length
        if (otp.length !== 6) {

            alert(
                "Please enter the complete 6-digit OTP."
            );

            return;

        }


        // Verify button
        const verifyBtn =
            document.getElementById("verifyBtn");

        verifyBtn.disabled = true;

        verifyBtn.textContent =
            "Verifying...";


        try {

            // ==================================
            // VERIFY OTP API
            // ==================================

            const response = await fetch(
                "http://localhost:5000/api/otp/verify-email-otp",
                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email: email,

                        otp: otp

                    })

                }
            );


            const result =
                await response.json();


            console.log(
                "OTP Verification:",
                result
            );


            // ==================================
            // SUCCESS
            // ==================================

            if (result.success) {

                alert(
                    "OTP verified successfully!"
                );


                // Save verification status
                localStorage.setItem(
                    "otpVerified",
                    "true"
                );


                // Go to reset password
                window.location.href =
                    "reset-password.html";

            }


            // ==================================
            // FAILED
            // ==================================

            else {

                alert(result.message);

                verifyBtn.disabled = false;

                verifyBtn.textContent =
                    "Verify OTP";

            }

        }


        // ======================================
        // SERVER ERROR
        // ======================================

        catch (error) {

            console.error(
                "OTP Verification Error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );


            verifyBtn.disabled = false;

            verifyBtn.textContent =
                "Verify OTP";

        }

    });


// ==========================================
// RESEND OTP
// ==========================================

resendBtn.addEventListener(
    "click",
    async () => {


        const email =
            localStorage.getItem("resetEmail");


        if (!email) {

            alert(
                "Email not found. Please start again."
            );

            window.location.href =
                "forgot-password.html";

            return;

        }


        resendBtn.disabled = true;

        resendBtn.textContent =
            "Sending...";


        try {

            // ==================================
            // SEND OTP AGAIN
            // ==================================

            const response = await fetch(
                "http://localhost:5000/api/otp/send-email-otp",
                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email: email

                    })

                }
            );


            const result =
                await response.json();


            if (result.success) {

                alert(
                    "New OTP sent successfully!"
                );


                // Restart page
                location.reload();

            }

            else {

                alert(result.message);

                resendBtn.disabled = false;

                resendBtn.textContent =
                    "Resend OTP";

            }

        }

        catch (error) {

            console.error(
                "Resend OTP Error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );


            resendBtn.disabled = false;

            resendBtn.textContent =
                "Resend OTP";

        }

    }
);