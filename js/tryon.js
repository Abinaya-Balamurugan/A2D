generateBtn.addEventListener("click", async function () {

    console.log("================================");
    console.log("GENERATE BUTTON CLICKED");
    console.log("================================");

    const userFile = upload.files[0];

    if (!userFile) {
        alert("Please upload your photo.");
        return;
    }

    if (!dressName) {
        alert("Please select a dress first.");
        return;
    }

    try {

        loading.style.display = "block";

        generateBtn.disabled = true;
        generateBtn.textContent = "Generating...";


        // =================================================
        // GET DRESS IMAGE
        // =================================================

        const dressPath =
            "image/dresses/" + dressName;

        console.log("Dress path:", dressPath);


        const dressResponse =
            await fetch(dressPath);


        if (!dressResponse.ok) {

            throw new Error(
                "Dress image not found: " + dressPath
            );

        }


        const dressBlob =
            await dressResponse.blob();


        const dressFile =
            new File(
                [dressBlob],
                dressName,
                {
                    type:
                    dressBlob.type || "image/jpeg"
                }
            );


        console.log(
            "Dress file created:",
            dressFile
        );


        // =================================================
        // FORM DATA
        // =================================================

        const formData =
            new FormData();


        formData.append(
            "userImage",
            userFile
        );


        formData.append(
            "dressImage",
            dressFile
        );


        console.log(
            "Sending user image..."
        );

        console.log(
            "Sending dress image..."
        );


        // =================================================
        // SEND TO FLASK
        // =================================================

        const response =
            await fetch(
                "http://127.0.0.1:5001/tryon",
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.json();


        console.log(
            "Flask response:",
            result
        );


        // =================================================
        // SUCCESS
        // =================================================

        if (result.success) {

            resultPreview.src =
                result.image +
                "?t=" +
                Date.now();


            resultPreview.style.display =
                "block";


            alert(
                "AI Try-On generated successfully!"
            );

        }

        // =================================================
        // ERROR
        // =================================================

        else {

            alert(
                "Try-On failed:\n\n" +
                result.message
            );

        }


    }

    catch (error) {

        console.error(
            "TRY-ON ERROR:",
            error
        );


        alert(
            "Try-On failed:\n\n" +
            error.message
        );

    }


    finally {

        loading.style.display =
            "none";


        generateBtn.disabled =
            false;


        generateBtn.textContent =
            "Generate Try-On";

    }

});