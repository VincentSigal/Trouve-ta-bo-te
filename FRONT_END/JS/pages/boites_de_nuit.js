/* ==========================
   PAGE BOÎTES DE NUIT
   Affiche toutes les boîtes
   regroupées par style musical
   ========================== */

import { init_overlay, show_overlay, close_overlay, on_overlay_click } from "../components/overlay.js";
import { init_burger } from "../components/burger.js";
import { init_newsletter } from "../components/newsletter.js";
import { scrollHeader, initBoutonEspacePro } from "../components/header.js";

document.addEventListener("DOMContentLoaded", async () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    initBoutonEspacePro();

    const reponse = await fetch("http://localhost:3000/api/boites");
    const boites = await reponse.json();

    remplirFiltreVille(boites);
    renderCategories(boites);
    initFiltreVille(boites);
});


/* ==========================
   POPULARITÉ : INCRÉMENTE LE COMPTEUR DE CLICS
   Posé une seule fois sur document (délégation),
   pour fonctionner même quand les catégories
   sont reconstruites (filtre par ville).
   ========================== */

document.addEventListener("click", (event) => {

    const lien = event.target.closest("[data-idclub]");

    if (lien === null) {
        return;
    }

    const idClub = lien.dataset.idclub;

    fetch(`http://localhost:3000/api/boites/${idClub}/click`, { method: "POST" });
});


/* ==========================
   FILTRE PAR VILLE
   ========================== */

function remplirFiltreVille(boites) {

    const selectVille = document.querySelector("#ville");

    const villes = [];

    boites.forEach((boite) => {
        if (!villes.includes(boite.city_name)) {
            villes.push(boite.city_name);
        }
    });

    villes.sort();

    villes.forEach((ville) => {

        const option = document.createElement("option");

        option.value = ville;
        option.textContent = ville;

        selectVille.appendChild(option);
    });
}

function initFiltreVille(boites) {

    const selectVille = document.querySelector("#ville");
    const btnReset = document.querySelector("#btn-filter");

    selectVille.addEventListener("change", () => appliquerFiltreVille(boites));

    btnReset.addEventListener("click", () => {
        selectVille.selectedIndex = 0;
        appliquerFiltreVille(boites);
    });
}

function appliquerFiltreVille(boites) {

    const selectVille = document.querySelector("#ville");
    const ville = selectVille.value;

    const errorMessage = document.querySelector(".error-filter");

    if (errorMessage) {
        errorMessage.remove();
    }

    // Aucun filtre : on affiche à nouveau toutes les boîtes
    if (ville === "") {
        renderCategories(boites);
        return;
    }

    const resultatFiltre = boites.filter((boite) => boite.city_name === ville);

    if (resultatFiltre.length === 0) {

        document.querySelector(".categories-container").innerHTML = "";

        document.querySelector(".club-filters").insertAdjacentHTML(
            "afterend",
            `<p class="error-filter">Aucune boîte ne correspond à votre recherche.</p>`
        );

        return;
    }

    renderCategories(resultatFiltre);
}


/* ==========================
   REGROUPEMENT PAR STYLE MUSICAL
   ========================== */

function groupByMusic(data) {

    // Objet qui contiendra chaque style musical
    // comme clé, et un tableau de boîtes comme valeur
    const groupes = {};

    data.forEach((boite) => {

        const style = boite.music_name;

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

function renderCategories(data) {

    const container = document.querySelector(".categories-container");

    const groupes = groupByMusic(data);

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
                            <address><a href="${boite.location_link}" target="_blank"
                                    title="${boite.city_name}">${boite.city_name}</a></address>
                        </div>
                        <div>
                            <p>#${boite.tags1}</p>
                            <p>#${boite.tags2}</p>
                            <div class="popdesc">
                                <p>${boite.description}</p>
                                <a href="/FRONT_END/HTML/details_boite.html?id=${boite.idClub}" data-idclub="${boite.idClub}" title="Voir plus de détails">Voir plus de détails</a>
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

    container.innerHTML = categories_html;

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
