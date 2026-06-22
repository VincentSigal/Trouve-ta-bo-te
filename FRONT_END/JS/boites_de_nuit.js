/* ==========================
   PAGE BOÎTES DE NUIT
   Affiche toutes les boîtes
   regroupées par style musical
   ========================== */

import { boites } from "../data/data_cards.js";
import { init_overlay, show_overlay, close_overlay, on_overlay_click } from "./overlay.js";
import { init_burger } from "./burger.js";
import { init_newsletter } from "./newsletter.js";
import { scrollHeader } from "./header.js";

document.addEventListener("DOMContentLoaded", () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    renderCategories();
});


/* ==========================
   REGROUPEMENT PAR STYLE MUSICAL
   ========================== */

function groupByMusic(data) {

    // Objet qui contiendra chaque style musical
    // comme clé, et un tableau de boîtes comme valeur
    const groupes = {};

    data.forEach((boite) => {

        const style = boite.music;

        // Si le style n'existe pas encore
        // dans l'objet, on crée un tableau vide
        if (!groupes[style]) {
            groupes[style] = [];
        }

        groupes[style].push(boite);
    });

    return groupes;
};


/* ==========================
   GENERATION DE LA PAGE
   ========================== */

function renderCategories() {

    const main_container = document.querySelector("main");

    const groupes = groupByMusic(boites);

    let categories_html = ``;

    // Parcourt chaque style musical
    // et génère sa section dédiée
    for (const style in groupes) {

        const boites_du_style = groupes[style];

        let cards_html = ``;

        // Génère une carte pour chaque boîte
        // appartenant à ce style musical
        boites_du_style.forEach((boite) => {
            cards_html += `
                <section class="card">
                    <div class="bgcard" style="background-image:url(${boite.background})">
                        <div>
                            <h3>${boite.name}</h3>
                            <address><a href="${boite.location.location_link}" target="_blank"
                                    title="${boite.location.location_name}">${boite.location.location_name}</a></address>
                        </div>
                        <div>
                            <p>#${boite.tags[0]}</p>
                            <p>#${boite.tags[1]}</p>
                            <div class="popdesc">
                                <p>${boite.description}</p>
                                <a href="${boite.linkDetails}?id=${boite.idClub}" title="Voir plus de détails">Voir plus de détails</a>
                            </div>
                        </div>
                    </div>
                </section>`;
        });

        categories_html += `
            <section class="categorie">
                <div class="headings_title">
                    <h2>${style}</h2>
                    <div class="trait"></div>
                    <img src="/FRONT_END/img/logo.png" alt="Logo Trouve ta boîte">
                </div>

                <div class="row-wrapper">
                    <button class="row-arrow row-arrow-left" title="Précédent">&#10094;</button>

                    <div class="touteslesboites">
                        ${cards_html}
                    </div>

                    <button class="row-arrow row-arrow-right" title="Suivant">&#10095;</button>
                </div>
            </section>`;
    };

    main_container.insertAdjacentHTML("beforeend", categories_html);

    initArrows();
    initCardsPopup();
};


/* ==========================
   FLECHES DE DEFILEMENT
   ========================== */

function initArrows() {

    // Récupère toutes les flèches gauche et droite
    const leftArrows = document.querySelectorAll(".row-arrow-left");
    const rightArrows = document.querySelectorAll(".row-arrow-right");

    leftArrows.forEach((arrow) => {
        arrow.addEventListener("click", () => {

            // Récupère la rangée de cartes
            // associée à cette flèche précise
            const row = arrow.closest(".row-wrapper").querySelector(".touteslesboites");

            row.scrollBy({ left: -300, behavior: "smooth" });
        });
    });

    rightArrows.forEach((arrow) => {
        arrow.addEventListener("click", () => {

            const row = arrow.closest(".row-wrapper").querySelector(".touteslesboites");

            row.scrollBy({ left: 300, behavior: "smooth" });
        });
    });
};


/* ==========================
   POPUP DES CARTES
   ========================== */

function initCardsPopup() {

    const cards_popup = document.querySelectorAll(".card");
    const popup = document.querySelector(".club-popup-card");

    cards_popup.forEach((card) => {

        card.addEventListener("click", () => {

            popup.innerHTML = card.outerHTML;

            const popupCard = popup.querySelector(".card");
            popupCard.classList.add("popcard");

            popup.classList.add("active");

            show_overlay();

            popupCard.addEventListener("click", () => {
                popup.classList.remove("active");
                close_overlay();
            });
        });
    });

    on_overlay_click(() => {
        popup.classList.remove("active");
        close_overlay();
    });
};
