// ==========================================
// FORGOT PASSWORD
// SEND EMAIL OTP
// ==========================================

const forgotForm =
    document.getElementById("forgotForm");


forgotForm.addEventListener("submit", async function (e) {

    e.preventDefault();


    // ======================================
    // GET EMAIL
    // ======================================

    const email =
        document.getElementById("email").value.trim();


    // ======================================
    // CHECK EMAIL
    // ======================================

    if (email === "") {

        alert("Please enter your email.");

        return;

    }


    // ======================================
    // BUTTON
    // ======================================

    const button =
        forgotForm.querySelector("button");

    button.disabled = true;

    button.textContent = "Sending OTP...";


    try {

        // ==================================
        // SEND OTP
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


        // ==================================
        // GET RESPONSE
        // ==================================

        const result =
            await response.json();


        console.log(
            "OTP Response:",
            result
        );


        // ==================================
        // SUCCESS
        // ==================================

        if (result.success) {

            // Save email temporarily
            localStorage.setItem(
                "resetEmail",
                email
            );


            alert(
                "OTP sent successfully to your email."
            );


            // Go to OTP page
            window.location.href =
                "verify-otp.html";

        }


        // ==================================
        // ERROR
        // ==================================

        else {

            alert(result.message);

            button.disabled = false;

            button.textContent = "Send OTP";

        }

    }


    // ======================================
    // SERVER CONNECTION ERROR
    // ======================================

    catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );

        alert(
            "Unable to connect to the backend server."
        );


        button.disabled = false;

        button.textContent = "Send OTP";

    }

});