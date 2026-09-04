// =====================================
// AI Virtual Dressing Room
// viewer.js
// =====================================

// Product Elements

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");

const tryOnBtn = document.getElementById("tryOnBtn");
const wishlistBtn = document.getElementById("wishlistBtn");

// ------------------------------
// Load Selected Dress
// ------------------------------

const selectedDress = JSON.parse(localStorage.getItem("selectedDress"));

if(selectedDress){

    productImage.src = selectedDress.image;

    productName.innerHTML = selectedDress.name;

}else{

    productImage.src = "images/dresses/dress1.jpg";

    productName.innerHTML = "Sample Dress";

}

// ------------------------------
// Try On Button
// ------------------------------

tryOnBtn.addEventListener("click",()=>{

    localStorage.setItem(
        "dressForTryOn",
        JSON.stringify(selectedDress)
    );

    window.location.href="tryon.html";

});

// ------------------------------
// Wishlist
// ------------------------------

wishlistBtn.addEventListener("click",()=>{

    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find(item=>item.name===selectedDress.name);

    if(!exists){

        wishlist.push(selectedDress);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        alert("Dress added to Wishlist ❤️");

    }else{

        alert("Already in Wishlist");

    }

});