let showPassword = false;
let showRepeatPassword = false;

const passwordField = document.querySelector("[data-password-field]");
const togglePasswordVisibilityButton = document.querySelector(
    "[data-toggle-pass-visibility]",
);
const passwordIcon = document.querySelector("[data-show-pass-icon]");

const repeatPasswordField = document.querySelector(
    "[data-repeat-password-field]",
);
const toggleRepeatPasswordVisibilityButton = document.querySelector(
    "[data-toggle-repeat-pass-visibility]",
);
const repeatPasswordIcon = document.querySelector("[data-repeat-pass-icon]");

function togglePassVisibility(whichField) {
    switch (whichField) {
        case "password": {
            if (showPassword) {
                passwordField.setAttribute("type", "text");
                passwordIcon.textContent = "visibility_off";
            } else {
                passwordField.setAttribute("type", "password");
                passwordIcon.textContent = "visibility";
            }
            break;
        }

        case "repeat-password": {
            if (showRepeatPassword) {
                repeatPasswordField.setAttribute("type", "text");
                repeatPasswordIcon.textContent = "visibility_off";
            } else {
                repeatPasswordField.setAttribute("type", "password");
                repeatPasswordIcon.textContent = "visibility";
            }
            break;
        }
    }
}

togglePasswordVisibilityButton.addEventListener("click", () => {
    showPassword = !showPassword;
    togglePassVisibility("password");
});

toggleRepeatPasswordVisibilityButton.addEventListener("click", () => {
    showRepeatPassword = !showRepeatPassword;
    togglePassVisibility("repeat-password");
});
