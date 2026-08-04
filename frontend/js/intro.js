const steps=[

{

title:"Welcome",

image:"image/Step1.png",

description:"Welcome to AI Virtual Dressing Room."

},

{

title:"Scan QR",

image:"image/Step2.png",

description:"Scan a retailer QR code."

},

{

title:"Open Website",

image:"image/Step3.png",

description:"Browse retailer products."

},

{

title:"Choose Dress",

image:"image/Step4.png",

description:"Select any dress you like."

},

{

title:"AI Try-On",

image:"image/Step5.png",

description:"Upload your photo and preview the dress using AI."

},

{

title:"Ready",

image:"image/Step6.png",

description:"Accept Terms & Conditions to continue."

}

];

let current=0;

const title=document.getElementById("title");
const image=document.getElementById("image");
const desc=document.getElementById("description");
const count=document.getElementById("count");

function loadStep(){

title.innerHTML=steps[current].title;

image.src=steps[current].image;

desc.innerHTML=steps[current].description;

count.innerHTML=(current+1)+" / "+steps.length;

}

loadStep();

document.getElementById("next").onclick=function(){

if(current<steps.length-1){

current++;

loadStep();

}
else{

window.location.href="terms.html";

}

}

document.getElementById("previous").onclick=function(){

if(current>0){

current--;

loadStep();

}

}

document.getElementById("skip").onclick=function(){

window.location.href="terms.html";

}