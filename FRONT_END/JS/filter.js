/* ==========================
FILTRAGE DES BOÎTES DE LA PAGE D'ACCUEIL
========================== */

import { boites } from "../data/data_cards.js";
import { renderCards } from "./cards_boites.js";
import { refreshCarrousel } from "./carousel_homepage.js";

export function init_filter() {

    // Récupération des éléments du formulaire
    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");
    const btnReset = document.querySelector("#btn-filter");

    // Filtrage automatique
    villeSelect.addEventListener("change", appliquerFiltres);
    musiqueSelect.addEventListener("change", appliquerFiltres);

    // Réinitialisation des filtres
    btnReset.addEventListener("click", () => {

        villeSelect.selectedIndex = 0;
        musiqueSelect.selectedIndex = 0;

        appliquerFiltres();

    });

}

function appliquerFiltres() {

    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");

    // Valeurs sélectionnées
    const ville = villeSelect.value;
    const musique = musiqueSelect.value;

    // Filtrage des boîtes
    const resultatFiltre = boites.filter((boite) => {

        const villeOk =
            ville === ""
            || boite.location.location_name === ville;

        const musiqueOk =
            musique === ""
            || boite.music === musique;

        return villeOk && musiqueOk;

    });

    // Vérifie si un message existe déjà
    const errorMessage = document.querySelector(".error-filter");

    // Aucun résultat
    if (resultatFiltre.length === 0) {

        if (!errorMessage) {

            document.querySelector(".club-filters").insertAdjacentHTML(
                "afterend",
                `<p class="error-filter">
                    Aucune boîte ne correspond à votre recherche.
                </p>`
            );

        }

        // Supprime les cartes
        renderCards([]);

        // Supprime les dots du carrousel
        document.querySelector(".carousel-pagination").innerHTML = "";

        return;
    }

    // Supprime le message d'erreur s'il existe
    if (errorMessage) {
        errorMessage.remove();
    }

    // Affiche les cartes filtrées
    renderCards(resultatFiltre);

    // Recrée le carrousel
    refreshCarrousel();

}

export function remplirFiltres() {

    const selectVille = document.querySelector("#ville");
    const selectMusique = document.querySelector("#musique");

    // ----------------------------
    // VILLES
    // ----------------------------

    const villes = [];

    boites.forEach((boite) => {

        const ville = boite.location.location_name;

        if (!villes.includes(ville)) {
            villes.push(ville);
        }

    });

    villes.sort();

    villes.forEach((ville) => {

        const option = document.createElement("option");

        option.value = ville;
        option.textContent = ville;

        selectVille.appendChild(option);

    });

    // ----------------------------
    // MUSIQUES
    // ----------------------------

    const musiques = [];

    boites.forEach((boite) => {

        if (!musiques.includes(boite.music)) {
            musiques.push(boite.music);
        }

    });

    musiques.sort();

    musiques.forEach((musique) => {

        const option = document.createElement("option");

        option.value = musique;
        option.textContent = musique;

        selectMusique.appendChild(option);

    });

}