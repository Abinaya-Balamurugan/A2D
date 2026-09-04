// ==========================================
// REGISTER PAGE
// AI Virtual Dressing Room
// ==========================================


// ==========================================
// GET ELEMENTS
// ==========================================

const registerForm = document.getElementById("registerForm");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirm");

const toggle1 = document.getElementById("toggle1");

const toggle2 = document.getElementById("toggle2");

const strengthBar = document.getElementById("strengthBar");


// ==========================================
// PASSWORD 1 - SHOW / HIDE
// ==========================================

toggle1.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        toggle1.innerHTML =
            '<i class="fa fa-eye-slash"></i>';

    } else {

        password.type = "password";

        toggle1.innerHTML =
            '<i class="fa fa-eye"></i>';

    }

});


// ==========================================
// PASSWORD 2 - SHOW / HIDE
// ==========================================

toggle2.addEventListener("click", () => {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        toggle2.innerHTML =
            '<i class="fa fa-eye-slash"></i>';

    } else {

        confirmPassword.type = "password";

        toggle2.innerHTML =
            '<i class="fa fa-eye"></i>';

    }

});


// ==========================================
// PASSWORD STRENGTH
// ==========================================

password.addEventListener("input", () => {

    const value = password.value;

    let strength = 0;


    // At least 8 characters
    if (value.length >= 8) {

        strength++;

    }


    // Contains uppercase
    if (/[A-Z]/.test(value)) {

        strength++;

    }


    // Contains lowercase
    if (/[a-z]/.test(value)) {

        strength++;

    }


    // Contains number
    if (/[0-9]/.test(value)) {

        strength++;

    }


    // Contains special character
    if (/[^A-Za-z0-9]/.test(value)) {

        strength++;

    }


    // Update strength bar

    if (strength === 0) {

        strengthBar.style.width = "0";

    }

    else if (strength === 1) {

        strengthBar.style.width = "20%";

    }

    else if (strength === 2) {

        strengthBar.style.width = "40%";

    }

    else if (strength === 3) {

        strengthBar.style.width = "60%";

    }

    else if (strength === 4) {

        strengthBar.style.width = "80%";

    }

    else {

        strengthBar.style.width = "100%";

    }

});


// ==========================================
// REGISTER FORM
// ==========================================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    // ======================================
    // GET FORM VALUES
    // ======================================

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const passwordValue =
        password.value;

    const confirmValue =
        confirmPassword.value;


    // ======================================
    // CHECK EMPTY FIELDS
    // ======================================

    if (
        name === "" ||
        email === "" ||
        phone === "" ||
        passwordValue === "" ||
        confirmValue === ""
    ) {

        alert("Please fill all fields.");

        return;

    }


    // ======================================
    // CHECK PHONE
    // ======================================

    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit mobile number.");

        return;

    }


    // ======================================
    // PASSWORD RULES
    // ======================================

    if (passwordValue.length < 8) {

        alert(
            "Password must contain at least 8 characters."
        );

        return;

    }


    if (!/[A-Z]/.test(passwordValue)) {

        alert(
            "Password must contain at least one uppercase letter."
        );

        return;

    }


    if (!/[a-z]/.test(passwordValue)) {

        alert(
            "Password must contain at least one lowercase letter."
        );

        return;

    }


    if (!/[0-9]/.test(passwordValue)) {

        alert(
            "Password must contain at least one number."
        );

        return;

    }


    if (!/[^A-Za-z0-9]/.test(passwordValue)) {

        alert(
            "Password must contain at least one special character."
        );

        return;

    }


    // ======================================
    // CONFIRM PASSWORD
    // ======================================

    if (passwordValue !== confirmValue) {

        alert("Passwords do not match.");

        return;

    }


    // ======================================
    // CREATE DATA
    // ======================================

    const data = {

        name: name,

        email: email,

        phone: phone,

        password: passwordValue

    };


    // ======================================
    // BUTTON
    // ======================================

    const registerButton =
        registerForm.querySelector("button[type='submit']");

    registerButton.disabled = true;

    registerButton.textContent =
        "Creating Account...";


    // ======================================
    // SEND TO BACKEND
    // ======================================

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(data)

            }
        );


        // ==================================
        // RESPONSE
        // ==================================

        const result =
            await response.json();


        console.log(
            "Register Response:",
            result
        );


        // ==================================
        // SUCCESS
        // ==================================

        if (result.success) {

            alert(
                "Account created successfully! 🎉"
            );


            // Go to login
            window.location.href =
                "login.html";

        }


        // ==================================
        // FAILED
        // ==================================

        else {

            alert(result.message);

            registerButton.disabled = false;

            registerButton.textContent =
                "Create Account";

        }

    }


    // ======================================
    // SERVER ERROR
    // ======================================

    catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        alert(
            "Cannot connect to the backend server. " +
            "Please make sure the backend is running."
        );


        registerButton.disabled = false;

        registerButton.textContent =
            "Create Account";

    }

});