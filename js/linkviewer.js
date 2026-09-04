const openBtn = document.getElementById("openBtn");

openBtn.addEventListener("click", () => {

    let url = document.getElementById("productLink").value.trim();

    if (url === "") {

        alert("Please paste a product link.");

        return;

    }

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url = "https://" + url;

    }

    // Save the product link for later use
    localStorage.setItem("productLink", url);

    // Open the product in a new tab
    window.open(url, "_blank");

});