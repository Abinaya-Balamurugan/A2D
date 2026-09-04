function onScanSuccess(decodedText){

document.getElementById("result").value=decodedText;

html5QrcodeScanner.clear();

}

let html5QrcodeScanner=

new Html5QrcodeScanner(

"reader",

{

fps:10,

qrbox:250

}

);

html5QrcodeScanner.render(onScanSuccess);

function openSite(){

const url=document.getElementById("result").value;

if(url===""){

alert("Scan a QR Code");

return;

}

localStorage.setItem("retailerLink",url);

window.location.href="viewer.html";

}