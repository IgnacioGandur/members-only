const toggleMobileNavbar = document.querySelector("#toggle-mobile-navbar");
const mobileNavbar = document.querySelector("#mobile-navbar");
const mobileNavbarIcon = document.querySelector("#toggle-mobile-navbar-icon");

let showMobileNavbar = false;

toggleMobileNavbar.addEventListener("click", () => {
    showMobileNavbar = !showMobileNavbar;
    showMobileNavbar
        ? mobileNavbar.classList.add("active")
        : mobileNavbar.classList.remove("active");
    mobileNavbarIcon.textContent = showMobileNavbar ? "close" : "menu";
});
