const passwordField = document.querySelector("#password");
const visibilityIcon = document.querySelector("[data-visibility-icon]");
const togglePassVisibilityButton = document.querySelector(
    "[data-toggle-pass-visibility]",
);

let showPass = false;

function togglePassVisibility() {
    if (showPass) {
        visibilityIcon.textContent = "visibility";
        passwordField.setAttribute("type", "text");
        password;
    } else {
        visibilityIcon.textContent = "visibility_off";
        passwordField.setAttribute("type", "password");
    }
}

togglePassVisibilityButton.addEventListener("click", () => {
    showPass = !showPass;
    togglePassVisibility();
});
