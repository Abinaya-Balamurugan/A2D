const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

// Show/Hide New Password
togglePassword.addEventListener("click", () => {

    if(password.type==="password"){

        password.type="text";

        togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

    }

    else{

        password.type="password";

        togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';

    }

});

// Show/Hide Confirm Password
toggleConfirmPassword.addEventListener("click", () => {

    if(confirmPassword.type==="password"){

        confirmPassword.type="text";

        toggleConfirmPassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

    }

    else{

        confirmPassword.type="password";

        toggleConfirmPassword.innerHTML='<i class="fa-solid fa-eye"></i>';

    }

});

// Reset Password

document.getElementById("resetForm")

.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=localStorage.getItem("resetEmail");

const newPassword=password.value;

const confirm=confirmPassword.value;

const regex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if(!regex.test(newPassword)){

alert("Password does not meet the required rules.");

return;

}

if(newPassword!==confirm){

alert("Passwords do not match.");

return;

}

try{

const response=await fetch("http://localhost:5000/api/reset-password",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password:newPassword

})

});

const result=await response.json();

alert(result.message);

if(result.success){

localStorage.removeItem("resetEmail");

window.location.href="login.html";

}

}

catch(error){

alert("Unable to connect to server.");

}

});