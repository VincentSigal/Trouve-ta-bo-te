/* ==========================
FILTRAGE DES BOÎTES DE LA PAGE D'ACCUEIL
========================== */

import { renderCards } from "./cards_boites.js";
import { refreshCarrousel } from "./carousel_homepage.js";

const NOMBRE_BOITES_POPULAIRES = 10;

export function init_filter(boites) {

    // Récupération des éléments du formulaire
    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");
    const btnReset = document.querySelector("#btn-filter");

    // Filtrage automatique
    villeSelect.addEventListener("change", () => appliquerFiltres(boites));
    musiqueSelect.addEventListener("change", () => appliquerFiltres(boites));

    // Réinitialisation des filtres
    btnReset.addEventListener("click", () => {

        villeSelect.selectedIndex = 0;
        musiqueSelect.selectedIndex = 0;

        appliquerFiltres(boites);

    });

}

function appliquerFiltres(boites) {

    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");

    // Valeurs sélectionnées
    const ville = villeSelect.value;
    const musique = musiqueSelect.value;

    const errorMessage = document.querySelector(".error-filter");

    // Aucun filtre actif : on revient aux boîtes les plus populaires
    if (ville === "" && musique === "") {

        if (errorMessage) {
            errorMessage.remove();
        }

        renderCards(boites.slice(0, NOMBRE_BOITES_POPULAIRES));
        refreshCarrousel();

        return;
    }

    // Filtrage des boîtes. L'API renvoie déjà les boîtes triées
    // par popularité, et filter() conserve cet ordre : pas besoin
    // de re-trier ici, et pas de limite à 10 quand un filtre est actif.
    const resultatFiltre = boites.filter((boite) => {

        const villeOk =
            ville === ""
            || boite.city_name === ville;

        const musiqueOk =
            musique === ""
            || boite.music_name === musique;

        return villeOk && musiqueOk;

    });

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

export function remplirFiltres(boites) {

    const selectVille = document.querySelector("#ville");
    const selectMusique = document.querySelector("#musique");

    // ----------------------------
    // VILLES
    // ----------------------------

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

    // ----------------------------
    // MUSIQUES
    // ----------------------------

    const musiques = [];

    boites.forEach((boite) => {

        if (!musiques.includes(boite.music_name)) {
            musiques.push(boite.music_name);
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