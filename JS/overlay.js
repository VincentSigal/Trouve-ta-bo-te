/* INTEGRER OVERLAY */

let overlay;

export function init_overlay() {
    const overlay_html = `
<div class="overlay"></div>`;

    document.body.insertAdjacentHTML("beforeend", overlay_html);

    overlay = document.querySelector(`.overlay`);
};

/* TOOLS OVERLAY */

export function show_overlay() {
    overlay.classList.add("overlay_active");
};

export function close_overlay() {
    overlay.classList.remove("overlay_active");
};

export function on_overlay_click(closePop) {
    overlay.addEventListener("click", closePop);
};