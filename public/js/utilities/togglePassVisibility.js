const togglePassVisibilityButtons = document.querySelectorAll(
    ".toggle-pass-visibility-button",
);

function togglePassVisibility(passInputField, passwordIcon) {
    const showPass = passInputField.getAttribute("data-show-pass");

    passInputField.setAttribute(
        "type",
        showPass === "false" ? "text" : "password",
    );
    passwordIcon.textContent =
        showPass === "false" ? "visibility_off" : "visibility";
    passInputField.setAttribute(
        "data-show-pass",
        showPass === "false" ? "true" : "false",
    );
}

togglePassVisibilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const passInputField = button.previousElementSibling;
        const passwordIcon = button.querySelector(
            "span.material-symbols-sharp",
        );
        togglePassVisibility(passInputField, passwordIcon);
    });
});
