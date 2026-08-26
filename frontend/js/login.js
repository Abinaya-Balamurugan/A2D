// ==========================================
// LOGIN PAGE
// AI Virtual Dressing Room
// ==========================================


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const togglePassword =
    document.getElementById("togglePassword");

const password =
    document.getElementById("password");


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
// LOGIN FORM
// ==========================================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener("submit", async function (e) {

    // Stop normal form submission
    e.preventDefault();


    // ======================================
    // GET VALUES
    // ======================================

    const email =
        document.getElementById("email").value.trim();

    const pass =
        document.getElementById("password").value;


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
        loginForm.querySelector("button[type='submit']");

    loginButton.disabled = true;

    loginButton.textContent = "Logging in...";


    try {

        // ==================================
        // SEND LOGIN REQUEST TO BACKEND
        // ==================================

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email,

                    password: pass

                })

            }
        );


        // ==================================
        // GET BACKEND RESPONSE
        // ==================================

        const result =
            await response.json();


        console.log("Login Response:", result);


        // ==================================
        // SUCCESS
        // ==================================

        if (result.success) {

            // Save JWT token
            localStorage.setItem(
                "token",
                result.token
            );


            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );


            alert("Login Successful!");


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

            alert(result.message);

            loginButton.disabled = false;

            loginButton.textContent = "Login";

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
            "Cannot connect to the server. " +
            "Please make sure the backend is running."
        );


        loginButton.disabled = false;

        loginButton.textContent = "Login";

    }

});