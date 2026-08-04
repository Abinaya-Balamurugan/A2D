// ===============================
// AI Virtual Dressing Room
// tryon.js
// ===============================

// Selected Dress

const dressName = localStorage.getItem("selectedDress");

const dressPreview = document.getElementById("dressPreview");

if (dressName) {

    dressPreview.src = "images/dresses/" + dressName;

}

// User Image Preview

const upload = document.getElementById("userImage");

const userPreview = document.getElementById("userPreview");

upload.addEventListener("change", function(e){

    const file = e.target.files[0];

    if(file){

        userPreview.src = URL.createObjectURL(file);

    }

});

// Generate Try-On

document.getElementById("generateBtn")

.addEventListener("click", async ()=>{

    const file = upload.files[0];

    if(!file){

        alert("Please upload your photo.");

        return;

    }

    document.getElementById("loading").style.display="block";

    try{

        const formData = new FormData();

        // User Image

        formData.append("userImage", file);

        // Dress Name

        formData.append("dressName", dressName);

        const response = await fetch(

            "http://127.0.0.1:5001/tryon",

            {

                method:"POST",

                body:formData

            }

        );

        const result = await response.json();

        document.getElementById("loading").style.display="none";

        if(result.success){

            document.getElementById("resultPreview").src=result.image;

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.error(error);

        document.getElementById("loading").style.display="none";

        alert("Cannot connect to AI Server.");

    }

});