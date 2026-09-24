const API_BASE_URL = "https://petite-papers-enjoy.loca.lt";

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Check empty fields
        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        try {
            console.log("Connecting to backend...");
            console.log("API:", API_BASE_URL);

            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log("Response status:", response.status);

            let data;

            try {
                data = await response.json();
            } catch (error) {
                console.error("Invalid server response:", error);
                alert("Server returned an invalid response.");
                return;
            }

            console.log("Server response:", data);

            if (response.ok) {

                alert(data.message || "Login successful!");

                // Save user information
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                if (data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );
                }

                // Go to home page
                window.location.href = "home.html";

            } else {

                alert(
                    data.message ||
                    data.error ||
                    "Invalid email or password."
                );
            }

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            alert(
                "Cannot connect to the server.\n\n" +
                "Please make sure your backend and LocalTunnel are running."
            );
        }
    });

});