// ======================================
// AI Virtual Dressing Room
// cart.js
// ======================================

const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

// Load Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add quantity if missing
cart.forEach(item => {
    if (!item.quantity) {
        item.quantity = 1;
    }
});

// Display Cart
function displayCart() {

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <h2 style="text-align:center;color:gray;">
                Your Cart is Empty 🛒
            </h2>
        `;

        totalPrice.innerHTML = "0";

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartContainer.innerHTML += `

        <div class="cart-card">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-details">

                <h2>${item.name}</h2>

                <p class="price">₹${item.price}</p>

                <div class="quantity">

                    <button onclick="decreaseQty(${index})">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQty(${index})">+</button>

                </div>

                <h3>Subtotal : ₹${item.price * item.quantity}</h3>

                <br>

                <button
                class="removeBtn"
                onclick="removeItem(${index})">

                Remove

                </button>

            </div>

        </div>

        `;

    });

    totalPrice.innerHTML = total;

    localStorage.setItem("cart", JSON.stringify(cart));

}

displayCart();

// Increase Quantity

function increaseQty(index){

    cart[index].quantity++;

    displayCart();

}

// Decrease Quantity

function decreaseQty(index){

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }

    displayCart();

}

// Remove Item

function removeItem(index){

    if(confirm("Remove this item from Cart?")){

        cart.splice(index,1);

        displayCart();

    }

}

// Checkout

checkoutBtn.addEventListener("click",()=>{

    if(cart.length===0){

        alert("Your Cart is Empty.");

        return;

    }

    alert("Proceeding to Checkout...");

    window.location.href="checkout.html";

});