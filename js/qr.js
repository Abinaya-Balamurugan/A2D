// ====================================
// AI Virtual Dressing Room
// QR Scanner
// ====================================

const websiteInput = document.getElementById("websiteLink");
const websiteFrame = document.getElementById("websiteFrame");
const openBtn = document.getElementById("openBtn");
const gotoTryOn = document.getElementById("gotoTryOn");

// ---------------------------
// Open Website Button
// ---------------------------

openBtn.addEventListener("click", () => {

    let url = websiteInput.value.trim();

    if(url === ""){

        alert("Please enter a website link.");

        return;

    }

    // Automatically add https://

    if(
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ){

        url = "https://" + url;

    }

    websiteInput.value = url;

    websiteFrame.src = url;

});

// ---------------------------
// QR Scanner
// ---------------------------

function onScanSuccess(decodedText){

    websiteInput.value = decodedText;

    websiteFrame.src = decodedText;

    html5QrCode.stop();

}

function onScanFailure(error){

    // Ignore scanning errors

}

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()

.then(devices=>{

    if(devices && devices.length){

        html5QrCode.start(

            { facingMode:"environment" },

            {

                fps:10,

                qrbox:250

            },

            onScanSuccess,

            onScanFailure

        );

    }

})

.catch(err=>{

    console.log(err);

});

// ---------------------------
// Go To Try On
// ---------------------------

gotoTryOn.addEventListener("click",()=>{

    window.location.href="tryon.html";

});