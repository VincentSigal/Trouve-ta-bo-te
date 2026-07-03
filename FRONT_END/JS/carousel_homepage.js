/* ==========================
   CARROUSEL INTERACTIF
   ========================== */


// Fonction appelée après un filtrage
// pour réinitialiser le carrousel
export let refreshCarrousel;

export function init_carrousel() {

    const carrousel = document.querySelector(".carousel-track");

    // Récupère toutes les cartes actuellement affichées
    // (important après un filtrage)
    function getCards() {
        return document.querySelectorAll(".card");
    }

    const nextBtn = document.querySelector(".row-arrow-right");
    const prevBtn = document.querySelector(".row-arrow-left");


    // État actuel du carrousel
    let currentIndex = 0; // Position actuelle du carrousel
    let startX = 0; // Position de départ du drag
    let isDragging = false; // Indique si un drag est en cours
    let currentTranslate = 0; // Position actuelle du track en pixels
    let prevTranslate = 0; // Dernière position enregistrée
    let visibleCards; // Nombre de cartes visibles à l'écran
    let maxIndex; // Nombre de position maximale du carrousel

    const NOMBRE_MAX_DOTS = 5;

    // Calcule la largeur réelle d'une carte
    // (largeur + espace entre les cartes)
    function getCardWidth() {
        return getCards()[0].offsetWidth + 20;
    };


    /* ==========================
    CALCUL DU CARROUSEL
    ========================== */
    // Détermine :
    // - combien de cartes sont visibles
    // - combien de positions le carrousel possède
    function calculateCarousel() {

        visibleCards = Math.floor(
            document.querySelector(".carousel-wrapper").offsetWidth
            / getCardWidth()
        );

        maxIndex = Math.max(0, getCards().length - visibleCards);
    };
    calculateCarousel();


    /* ==========================
       DEPLACEMENT DU CARROUSEL
       ========================== */
    // Déplace le track à la position correspondant
    // à currentIndex puis met à jour les dots
    function updateCarrousel() {

        const largeurCarte = getCardWidth();

        currentTranslate = -currentIndex * largeurCarte;
        prevTranslate = currentTranslate;

        carrousel.style.transform = `translateX(${currentTranslate}px)`;

        updateDots();
    };


    /* ==========================
       BOUTONS PRECEDENT / SUIVANT
       ========================== */
    // Avance d'une position vers la droite
    nextBtn.addEventListener("click", () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarrousel();
        };
    });
    // Revient d'une position vers la gauche
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarrousel();
        }
    });


    /* ==========================
       PAGINATION (DOTS)
       ========================== */
    // Génère automatiquement le nombre de dots (LIMITE A 5)
    // en fonction du nombre de positions possibles
    const dotsContainer = document.querySelector(".carousel-pagination");
    function createDots() {

        dotsContainer.innerHTML = "";

        const nombreDots = Math.min(maxIndex + 1, NOMBRE_MAX_DOTS);

        for (let i = 0; i < nombreDots; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");

            dot.addEventListener("click", () => {
                currentIndex = positionPourDot(i, nombreDots);
                updateCarrousel();
            });

            dotsContainer.appendChild(dot);
        }

        updateDots();
    };

    // Convertit un index de dot (0, 1, 2...) en position
    // réelle du carrousel, répartie proportionnellement
    function positionPourDot(indexDot, nombreDots) {

        if (nombreDots <= 1) return 0;

        return Math.round((indexDot / (nombreDots - 1)) * maxIndex);
    };
    calculateCarousel();
    createDots();
    // Met en évidence le dot correspondant
    // à la position actuelle du carrousel
    function updateDots() {

        const dots = document.querySelectorAll(".dot");
        const nombreDots = dots.length;

        let dotActif = 0;

        if (nombreDots > 1 && maxIndex > 0) {
            dotActif = Math.round((currentIndex / maxIndex) * (nombreDots - 1));
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle("dot_active", i === dotActif);
        });
    };


    /* ==========================
       DRAG SOURIS
       ========================== */
    // Début du drag
    carrousel.addEventListener("mousedown", (event) => {
        if (maxIndex === 0) return;
        isDragging = true;
        startX = event.pageX;
        event.preventDefault();
    });
    // Fin du drag :
    // on calcule la carte la plus proche
    // puis on replace correctement le carrousel
    document.addEventListener("mouseup", () => {
        if (!isDragging) return;

        isDragging = false;

        prevTranslate = currentTranslate;
        const largeurCarte = getCardWidth();

        currentIndex = Math.round(-currentTranslate / largeurCarte);

        updateCarrousel();
        setTimeout(() => {
            carrousel.classList.remove("dragging");
        }, 0);
    });
    // Pendant le déplacement de la souris :
    // on suit le mouvement tout en empêchant
    // de sortir des limites du carrousel
    document.addEventListener("mousemove", (event) => {

        if (!isDragging) return;

        const distance = event.pageX - startX;
        if (Math.abs(distance) > 5) {
            carrousel.classList.add("dragging");

        };
        currentTranslate = prevTranslate + distance;

        const largeurCarte = getCardWidth();

        const maxTranslate = 0;
        const minTranslate = -(getCards().length - visibleCards) * largeurCarte;

        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        };

        if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        };

        carrousel.style.transform = `translateX(${currentTranslate}px)`;

    });


    /* ==========================
   RESPONSIVE
   ========================== */
    // Recalcule le carrousel lorsque
    // la taille de la fenêtre change
    window.addEventListener("resize", () => {

        calculateCarousel();

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        createDots();

        updateCarrousel();

    });


    /* ==========================
   VERSION TACTILE
   ========================== */
    // Début du swipe
    carrousel.addEventListener("touchstart", (event) => {
        if (maxIndex === 0) return;
        isDragging = true;
        startX = event.touches[0].pageX;
    });
    // Déplacement du doigt
    document.addEventListener("touchmove", (event) => {

        if (!isDragging) return;

        const distance = event.touches[0].pageX - startX;

        currentTranslate = prevTranslate + distance;

        const largeurCarte = getCardWidth();

        const maxTranslate = 0;
        const minTranslate = -(getCards().length - visibleCards) * largeurCarte;

        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        };

        if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        };

        carrousel.style.transform =
            `translateX(${currentTranslate}px)`;

    });
    // Fin du swipe
    document.addEventListener("touchend", () => {

        if (!isDragging) return;

        isDragging = false;

        prevTranslate = currentTranslate;

        const largeurCarte = getCardWidth();

        currentIndex = Math.round(
            -currentTranslate / largeurCarte
        );

        updateCarrousel();

    });


    /* ==========================
       RAFRAICHISSEMENT APRES FILTRE
       ========================== */
    // Réinitialise complètement le carrousel
    // après un filtrage des cartes
    refreshCarrousel = () => {

        currentIndex = 0;

        calculateCarousel();
        createDots();
        updateCarrousel();
    };
};