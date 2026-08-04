document.getElementById("forgotForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const email = document.getElementById("email").value;

    try{

        const response = await fetch("http://localhost:5000/api/forgot-password",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email
            })

        });

        const result = await response.json();

        alert(result.message);

        if(result.success){

            localStorage.setItem("resetEmail",email);

            window.location.href="verify-otp.html";

        }

    }

    catch(error){

        console.error(error);

        alert("Unable to connect to the server.");

    }

});