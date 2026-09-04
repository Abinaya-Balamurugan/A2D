// ==========================================
// LOGIN PAGE
// AI VIRTUAL DRESSING ROOM
// ==========================================


// ==========================================
// BACKEND URL
// ==========================================

// Node.js backend - port 5000
const API_BASE_URL = "https://wicked-mirrors-lose.loca.lt";


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {

    togglePassword.addEventListener("click", function () {

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

}


// ==========================================
// LOGIN FORM
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        // Prevent normal form submission
        e.preventDefault();


        // ==================================
        // GET VALUES
        // ==================================

        const emailElement =
            document.getElementById("email");

        const passwordElement =
            document.getElementById("password");


        const email =
            emailElement.value.trim();

        const pass =
            passwordElement.value;


        // ==================================
        // CHECK EMPTY FIELDS
        // ==================================

        if (email === "" || pass === "") {

            alert("Please fill all fields.");

            return;

        }


        // ==================================
        // LOGIN BUTTON
        // ==================================

        const loginButton =
            loginForm.querySelector(
                "button[type='submit']"
            );


        const originalText =
            loginButton.textContent;


        loginButton.disabled = true;

        loginButton.textContent = "Logging in...";


        // ==================================
        // SEND LOGIN REQUEST
        // ==================================

        try {

            console.log(
                "Connecting to:",
                API_BASE_URL + "/api/auth/login"
            );


            const response = await fetch(
                API_BASE_URL + "/api/auth/login",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email: email,

                        password: pass

                    })

                }
            );


            // ==================================
            // CHECK RESPONSE
            // ==================================

            console.log(
                "HTTP Status:",
                response.status
            );


            // ==================================
            // READ RESPONSE
            // ==================================

            const result =
                await response.json();


            console.log(
                "Login Response:",
                result
            );


            // ==================================
            // LOGIN SUCCESS
            // ==================================

            if (
                response.ok &&
                result.success
            ) {

                // Save JWT token
                if (result.token) {

                    localStorage.setItem(
                        "token",
                        result.token
                    );

                }


                // Save user information
                if (result.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(result.user)
                    );

                }


                alert("Login Successful!");


                // ==================================
                // GO TO INTRO PAGE
                // ==================================

                window.location.href =
                    "intro.html";


                return;

            }


            // ==================================
            // LOGIN FAILED
            // ==================================

            alert(
                result.message ||
                "Invalid email or password."
            );


            loginButton.disabled = false;

            loginButton.textContent =
                originalText;


        } catch (error) {

            // ==================================
            // CONNECTION ERROR
            // ==================================

            console.error(
                "Login Error:",
                error
            );


            alert(
                "Cannot connect to the server.\n\n" +
                "Please make sure the Node.js backend " +
                "and LocalTunnel are running."
            );


            loginButton.disabled = false;

            loginButton.textContent =
                originalText;

        }

    });

}