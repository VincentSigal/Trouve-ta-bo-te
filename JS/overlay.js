/* ==========================
   OVERLAY GLOBAL
   ========================== */
// Référence vers l'overlay utilisé
// par les différentes popups du site

let overlay;

// Crée l'overlay et l'ajoute au document
export function init_overlay() {
    const overlay_html = `
<div class="overlay"></div>`;

    document.body.insertAdjacentHTML("beforeend", overlay_html);

    // Stocke la référence pour pouvoir
    // manipuler l'overlay depuis les autres fonctions
    overlay = document.querySelector(`.overlay`);
};

/* ==========================
   OUTILS OVERLAY
   ========================== */

   // Affiche l'overlay
export function show_overlay() {
    overlay.classList.add("active");
};

// Masque l'overlay
export function close_overlay() {
    overlay.classList.remove("active");
};

// Exécute une fonction lorsque
// l'utilisateur clique sur l'overlay
export function on_overlay_click(closePop) {
    overlay.addEventListener("click", closePop);
};