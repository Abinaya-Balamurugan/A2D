const otpInputs = document.querySelectorAll(".otp");

// Auto Move Next Box
otpInputs.forEach((input,index)=>{

input.addEventListener("input",()=>{

if(input.value.length===1 && index<otpInputs.length-1){

otpInputs[index+1].focus();

}

});

input.addEventListener("keydown",(e)=>{

if(e.key==="Backspace" && input.value==="" && index>0){

otpInputs[index-1].focus();

}

});

});

// Countdown

let seconds=60;

const countdown=document.getElementById("countdown");

const resendBtn=document.getElementById("resendBtn");

const timer=setInterval(()=>{

seconds--;

countdown.innerHTML=`Resend OTP in ${seconds}s`;

if(seconds<=0){

clearInterval(timer);

countdown.innerHTML="Didn't receive OTP?";

resendBtn.disabled=false;

}

},1000);

// Verify OTP

document.getElementById("verifyBtn")

.addEventListener("click",async()=>{

const email=localStorage.getItem("resetEmail");

let otp="";

otpInputs.forEach(box=>{

otp+=box.value;

});

try{

const response=await fetch("http://localhost:5000/api/verify-otp",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

otp

})

});

const result=await response.json();

alert(result.message);

if(result.success){

window.location.href="reset-password.html";

}

}catch(err){

alert("Server Error");

}

});

// Resend OTP

resendBtn.addEventListener("click",async()=>{

const email=localStorage.getItem("resetEmail");

await fetch("http://localhost:5000/api/forgot-password",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email

})

});

alert("OTP Sent Again");

location.reload();

});