/* ==========================
   HEADER AU SCROLL
   ========================== */

export function scrollHeader() {

    // Header qui sera masqué ou affiché
    const header = document.querySelector("#header");

    // Position précédente du scroll
    let lastScroll = window.scrollY;

    // Détecte chaque déplacement vertical de la page
    window.addEventListener("scroll", () => {

        // Position actuelle du scroll
        const currentScroll = window.scrollY;

        // Si l'utilisateur descend,
        // on masque le header
        if (currentScroll > lastScroll) {
            header.classList.add("hidden");

            // Si l'utilisateur remonte,
            // on réaffiche le header
        } else {
            header.classList.remove("hidden");
        }

        // Mémorise la position actuelle
        // pour le prochain scroll
        lastScroll = currentScroll;
    });
};