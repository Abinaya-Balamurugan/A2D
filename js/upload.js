const input=document.getElementById("imageInput");

const preview=document.getElementById("preview");

input.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(file){

preview.src=URL.createObjectURL(file);

localStorage.setItem("userimage",preview.src);

}

});

document.getElementById("nextBtn").onclick=function(){

if(input.files.length===0){

alert("Please upload your image");

return;

}

window.location.href="dress.html";

}