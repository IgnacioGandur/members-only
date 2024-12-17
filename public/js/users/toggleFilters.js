const toggleFiltersButton = document.querySelector("#toggle-filters");
const buttonSection = document.querySelector(".button-section");
const filtersSection = document.querySelector(".filters-section");
const hideFiltersButton = document.querySelector("#hide-filters");

toggleFiltersButton.addEventListener("click", () => {
    buttonSection.classList.toggle("hide");
    filtersSection.classList.toggle("show");
});

hideFiltersButton.addEventListener("click", () => {
    buttonSection.classList.toggle("hide");
    filtersSection.classList.toggle("show");
});
