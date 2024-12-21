const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.setProperty(
                "animation-delay",
                `${index * 3}00ms`,
            );
            entry.target.classList.add("show");
        }
    });
});

sections.forEach((section) => {
    observer.observe(section);
});

const tools = document.querySelectorAll(".tool");
const toolsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(
                (index + 1) % 2 === 0 ? "appear-even" : "appear-odd",
            );
        } else {
            entry.target.classList.remove(
                (index + 1) % 2 === 0 ? "appear-even" : "appear-odd",
            );
        }
    });
});

tools.forEach((tool) => {
    toolsObserver.observe(tool);
});
