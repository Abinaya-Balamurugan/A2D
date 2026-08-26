// ========================================
// AI Virtual Dressing Room
// wishlist.js
// ========================================

const wishlistContainer = document.getElementById("wishlistContainer");
const searchBox = document.getElementById("searchBox");

// Load Wishlist
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Display Wishlist
function displayWishlist(items){

    wishlistContainer.innerHTML = "";

    if(items.length === 0){

        wishlistContainer.innerHTML = `
            <h2 style="text-align:center;color:#777;">
                No Dresses in Wishlist ❤️
            </h2>
        `;

        return;

    }

    items.forEach((dress,index)=>{

        wishlistContainer.innerHTML += `

        <div class="card">

            <img src="${dress.image}" alt="${dress.name}">

            <div class="card-body">

                <h3>${dress.name}</h3>

                <p class="price">₹${dress.price}</p>

                <div class="buttons">

                    <button
                    class="tryBtn"
                    onclick="tryOn(${index})">

                    👗 Try On

                    </button>

                    <button
                    class="cartBtn"
                    onclick="moveToCart(${index})">

                    🛒 Move to Cart

                    </button>

                    <button
                    class="removeBtn"
                    onclick="removeItem(${index})">

                    🗑 Remove

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

// First Load
displayWishlist(wishlist);

// Search

searchBox.addEventListener("keyup",()=>{

    const text = searchBox.value.toLowerCase();

    const filtered = wishlist.filter(item=>

        item.name.toLowerCase().includes(text)

    );

    displayWishlist(filtered);

});

// Remove

function removeItem(index){

    if(confirm("Remove this dress from Wishlist?")){

        wishlist.splice(index,1);

        localStorage.setItem(

            "wishlist",

            JSON.stringify(wishlist)

        );

        displayWishlist(wishlist);

    }

}

// Move To Cart

function moveToCart(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(wishlist[index]);

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    alert("Dress moved to Cart 🛒");

}

// Try On

function tryOn(index){

    localStorage.setItem(

        "selectedDress",

        JSON.stringify(wishlist[index])

    );

    window.location.href = "tryon.html";

}