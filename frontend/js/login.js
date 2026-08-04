document.getElementById("loginForm").addEventListener("submit", async(e)=>{

e.preventDefault();

const data={

email:document.getElementById("email").value,

password:document.getElementById("password").value

};

const res=await fetch("http://localhost:5000/api/auth/login",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

const result=await res.json();

if(result.success){

localStorage.setItem("token",result.token);

localStorage.setItem("user",JSON.stringify(result.user));

window.location.href="intro.html";

}

else{

alert(result.message);

}

});
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        password.type = "password";
        togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }

});