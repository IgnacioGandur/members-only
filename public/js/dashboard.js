const bubbleSoundEffect = new Audio("/sound_effects/bubble_sound_effect.wav");
const allRadioButtons = document.querySelectorAll('input[type="radio"]');

allRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener("click", (e) => {
        bubbleSoundEffect.play();
    });
});
