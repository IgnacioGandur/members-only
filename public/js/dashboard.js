const bubbleSoundEffect = new Audio("/sound_effects/bubble_sound_effect.wav");
const allRadioButtons = document.querySelectorAll('input[type="radio"]');
const allIcons = document.querySelectorAll(".material-symbols-sharp");
const passInputs = document.querySelectorAll("[data-pass-field]");
const passIcons = document.querySelectorAll("[data-pass-icon]");
const togglePassVisibilityButtons = document.querySelectorAll(
    "[data-toggle-pass-visibility]",
);

let showPass = true;

function togglePassVisibility(inputElement) {
    if (showPass) {
        inputElement.setAttribute("type", "text");
    } else {
        inputElement.setAttribute("type", "password");
    }
    showPass = !showPass;
}

togglePassVisibilityButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const element = e.target.closest("button").previousElementSibling;
        const button = e.target.closest("button");
        if (showPass) {
            button.querySelector("span").textContent = "visibility_off";
        } else {
            button.querySelector("span").textContent = "visibility";
        }
        togglePassVisibility(element);
    });
});

allIcons.forEach((icon) => {
    icon.classList.add("notranslate");
});

allRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener("click", (e) => {
        bubbleSoundEffect.play();
    });
});
