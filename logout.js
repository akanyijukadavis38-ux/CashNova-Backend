function logoutUser() {

const confirmLogout =
    window.confirm("Are you sure you want to logout?");

// CANCEL → DO NOTHING
if (!confirmLogout) {
    return;
}

// CONFIRM → CLEAR LOGIN SESSION
localStorage.removeItem("cashnovaCurrentUser");
localStorage.removeItem("cashnovaUserId");

// GO TO LOGIN PAGE
window.location.href = "login.html";

}
