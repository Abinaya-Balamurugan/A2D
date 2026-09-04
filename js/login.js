// ==========================================
// LOGIN PAGE
// AI Virtual Dressing Room
// ==========================================


// ==========================================
// BACKEND URL
// ==========================================

const API_URL = "https://brave-bags-relax.loca.lt";


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const togglePassword =
    document.getElementById("togglePassword");

const password =
    document.getElementById("password");


if (togglePassword && password) {

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

}


// ==========================================
// LOGIN FORM
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            // Stop normal form submission
            e.preventDefault();


            // ======================================
            // GET VALUES
            // ======================================

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const pass =
                document
                    .getElementById("password")
                    .value;


            // ======================================
            // CHECK EMPTY FIELDS
            // ======================================

            if (email === "" || pass === "") {

                alert("Please fill all fields.");

                return;

            }


            // ======================================
            // LOGIN BUTTON
            // ======================================

            const loginButton =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";


            try {

                console.log(
                    "Connecting to:",
                    API_URL + "/api/auth/login"
                );


                // ==================================
                // SEND LOGIN REQUEST
                // ==================================

                const response =
                    await fetch(
                        API_URL +
                        "/api/auth/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                email: email,

                                password: pass

                            })

                        }
                    );


                // ==================================
                // GET RESPONSE
                // ==================================

                const result =
                    await response.json();


                console.log(
                    "Login Response:",
                    result
                );


                // ==================================
                // SUCCESS
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
                            JSON.stringify(
                                result.user
                            )
                        );

                    }


                    alert(
                        "Login Successful!"
                    );


                    // =================================
                    // GO TO INTRO PAGE
                    // =================================

                    window.location.href =
                        "intro.html";

                }


                // ==================================
                // LOGIN FAILED
                // ==================================

                else {

                    alert(
                        result.message ||
                        "Invalid email or password."
                    );

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";

                }

            }


            // ======================================
            // SERVER CONNECTION ERROR
            // ======================================

            catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                alert(
                    "Cannot connect to the server.\n\n" +
                    "Please make sure your backend and " +
                    "LocalTunnel are running."
                );


                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

            }

        }
    );

}