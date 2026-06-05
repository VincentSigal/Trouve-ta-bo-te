export function scrollHeader() {
    const header = document.querySelector("#header");

    let lastScroll = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }

        lastScroll = currentScroll;
    });
};