// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("selectedDress");

    window.location.href =
        "login.html";
}



// ==========================================
// SELECT DRESS
// ==========================================

function selectDress(dressName) {

    console.log(
        "Selected dress:",
        dressName
    );


    // Save selected dress

    localStorage.setItem(
        "selectedDress",
        dressName
    );


    // Open Try-On page

    window.location.href =
        "tryon.html";

}