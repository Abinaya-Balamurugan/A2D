// ==========================================
// RESET PASSWORD
// AI Virtual Dressing Room
// ==========================================


// ==========================================
// GET ELEMENTS
// ==========================================

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


// ==========================================
// SHOW / HIDE NEW PASSWORD
// ==========================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});


// ==========================================
// SHOW / HIDE CONFIRM PASSWORD
// ==========================================

toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        confirmPassword.type = "password";

        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});


// ==========================================
// RESET PASSWORD FORM
// ==========================================

document
    .getElementById("resetForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();


        // ======================================
        // GET EMAIL
        // ======================================

        const email =
            localStorage.getItem("resetEmail");


        // ======================================
        // CHECK EMAIL
        // ======================================

        if (!email) {

            alert(
                "Reset session expired. Please request a new OTP."
            );

            window.location.href =
                "forgot-password.html";

            return;

        }


        // ======================================
        // CHECK OTP VERIFICATION
        // ======================================

        const otpVerified =
            localStorage.getItem("otpVerified");


        if (otpVerified !== "true") {

            alert(
                "Please verify the OTP first."
            );

            window.location.href =
                "verify-otp.html";

            return;

        }


        // ======================================
        // GET PASSWORDS
        // ======================================

        const newPassword =
            password.value;

        const confirm =
            confirmPassword.value;


        // ======================================
        // PASSWORD RULES
        // ======================================

        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


        if (!regex.test(newPassword)) {

            alert(
                "Password must contain at least 8 characters, " +
                "one uppercase letter, one lowercase letter, " +
                "one number, and one special character."
            );

            return;

        }


        // ======================================
        // CONFIRM PASSWORD
        // ======================================

        if (newPassword !== confirm) {

            alert(
                "Passwords do not match."
            );

            return;

        }


        // ======================================
        // BUTTON
        // ======================================

        const resetButton =
            document.querySelector(
                "#resetForm button[type='submit']"
            );


        resetButton.disabled = true;

        resetButton.textContent =
            "Updating Password...";


        // ======================================
        // SEND TO BACKEND
        // ======================================

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/reset-password",
                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email: email,

                        password: newPassword

                    })

                }
            );


            // ==================================
            // GET RESPONSE
            // ==================================

            const result =
                await response.json();


            console.log(
                "Reset Password Response:",
                result
            );


            // ==================================
            // SUCCESS
            // ==================================

            if (result.success) {

                alert(
                    "Password reset successfully! 🎉"
                );


                // Remove reset information
                localStorage.removeItem(
                    "resetEmail"
                );

                localStorage.removeItem(
                    "otpVerified"
                );


                // Go to login
                window.location.href =
                    "login.html";

            }


            // ==================================
            // ERROR
            // ==================================

            else {

                alert(result.message);

                resetButton.disabled = false;

                resetButton.textContent =
                    "Reset Password";

            }

        }


        // ======================================
        // SERVER ERROR
        // ======================================

        catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );


            resetButton.disabled = false;

            resetButton.textContent =
                "Reset Password";

        }

    });