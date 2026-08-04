const agree=document.getElementById("agree");

const continueBtn=document.getElementById("continueBtn");

agree.addEventListener("change",function(){

continueBtn.disabled=!this.checked;

});

continueBtn.addEventListener("click",function(){

window.location.href="home.html";

});

document.getElementById("backBtn").addEventListener("click",function(){

window.location.href="intro.html";

});