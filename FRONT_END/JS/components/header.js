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

/* ==========================
   BOUTON "ESPACE PRO" / "MON ESPACE"

   Si un token est présent (personne connectée),
   le bouton .btn-espace-pro devient "Mon espace"
   avec une icône, et pointe directement vers le
   tableau de bord au lieu de la page de connexion.
   ========================== */

export function initBoutonEspacePro() {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Personne non connectée : le bouton garde
    // son comportement par défaut (déjà dans le HTML)
    if (token === null) {
        return;
    }

    const boutons = document.querySelectorAll(".btn-espace-pro");

    boutons.forEach((bouton) => {
        bouton.href = "/FRONT_END/HTML/Espace_pro.html";
        bouton.title = "Mon espace";
        bouton.querySelector("span").textContent = "Mon Espace";
    });
};