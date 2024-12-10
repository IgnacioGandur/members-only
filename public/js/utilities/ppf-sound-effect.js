const bubbleSoundEffect = new Audio("/sound_effects/bubble_sound_effect.wav");
const allRadioButtons = document.querySelectorAll('input[type="radio"]');
const allIcons = document.querySelectorAll(".material-symbols-sharp");

allIcons.forEach((icon) => {
    icon.classList.add("notranslate");
});

allRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener("mousedown", () => {
        radioButton.checked ? null : bubbleSoundEffect.play();
    });
});
