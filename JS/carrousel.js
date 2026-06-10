/* INTERACTIVE CARROUSEL */

export function init_carrousel() {

    const carrousel = document.querySelector(".carroussel");
    const cards = document.querySelectorAll(".card");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    let currentIndex = 0; // POSITION DU CARROUSEL
    let startX = 0; // POSITION QUAND ON CLIC
    let isDragging = false;
    let hasDragged = false;
    let currentTranslate = 0; // DISTANCE PARCOURUE A LA SOURIS
    let prevTranslate = 0;
    let visibleCards; // NOMBRE DE CARDS VISIBLE A L'ECRAN
    let maxIndex; // NOMBRE DE POSITION MAXIMUM DU CARROUSEL
    function getCardWidth() { // OBTENIR LA LARGUEUR D'UNE CARTE
        return cards[0].offsetWidth + 20;
    };

    /* PERMET DE CONNAITRE LE NOMBRE DE CARTES A L'ECRAN AINSI QUE L'INDEX MAX DU CARROUSEL EN FONCTION DU NOMBRE DE CARTES EN DEHORS DE L'ECRAN */
    function calculateCarousel() {

        visibleCards = Math.floor(
            document.querySelector(".carrousel-wrapper").offsetWidth
            / getCardWidth()
        );

        maxIndex = Math.max(0, cards.length - visibleCards);
    };
    calculateCarousel();


    /* DEPLACE LE CARROUSEL */
    function updateCarrousel() {

        const largeurCarte = getCardWidth();

        currentTranslate = -currentIndex * largeurCarte;
        prevTranslate = currentTranslate;

        carrousel.style.transform = `translateX(${currentTranslate}px)`;

        updateDots();
    };


    /* FLECHE DROITE DU CARROUSEL */
    nextBtn.addEventListener("click", () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarrousel();
        };
    });
    /* FLECHE GAUCHE DU CARROUSEL */
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarrousel();
        }
    });


    /* CREER LE NOMBRE DE DOT EQUIVALENT AU MAX INDEX DU CARROUSEL */
    const dotsContainer = document.querySelector(".dots");

    function createDots() {

        dotsContainer.innerHTML = "";

        for (let i = 0; i <= maxIndex; i++) {

            const dot = document.createElement("div");

            dot.classList.add("dot");

            if (i === currentIndex) {
                dot.classList.add("dot_active");
            };

            dot.addEventListener("click", () => {

                currentIndex = i;

                updateCarrousel();

            });

            dotsContainer.appendChild(dot);

        };

    };
    calculateCarousel();
    createDots();

    function updateDots() {

        const dots = document.querySelectorAll(".dot");

        dots.forEach(dot => dot.classList.remove("dot_active"));

        dots[currentIndex].classList.add("dot_active");

    };
    carrousel.addEventListener("mousedown", (event) => {

        isDragging = true;
        hasDragged = false;
        startX = event.pageX;
        event.preventDefault();
    });

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

    document.addEventListener("mousemove", (event) => {

        if (!isDragging) return;

        const distance = event.pageX - startX;
        if (Math.abs(distance) > 5) {
            carrousel.classList.add("dragging");
        };
        currentTranslate = prevTranslate + distance;

        const largeurCarte = getCardWidth();

        const maxTranslate = 0;
        const minTranslate = -(cards.length - visibleCards) * largeurCarte;

        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        };

        if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        };

        carrousel.style.transform = `translateX(${currentTranslate}px)`;

    });
    window.addEventListener("resize", () => {

        calculateCarousel();

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        createDots();

        updateCarrousel();

    });
    carrousel.addEventListener("touchstart", (event) => {

        isDragging = true;
        startX = event.touches[0].pageX;
    });
    document.addEventListener("touchmove", (event) => {

        if (!isDragging) return;

        const distance = event.touches[0].pageX - startX;

        currentTranslate = prevTranslate + distance;

        const largeurCarte = getCardWidth();

        const maxTranslate = 0;
        const minTranslate = -(cards.length - visibleCards) * largeurCarte;

        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        };

        if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        };

        carrousel.style.transform =
            `translateX(${currentTranslate}px)`;

    });
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
};