import { boites } from "../data/data_cards.js";
import { renderCards } from "./cards_boites.js";
import { refreshCarrousel } from "./carrousel.js";

export function init_filter() {

    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");
    const filterBtn = document.querySelector("#btn-filter");

    filterBtn.addEventListener("click", () => {

        const ville = villeSelect.value;
        const musique = musiqueSelect.value;

        if (ville === "" && musique === "") {
            return;
        }

        const resultatFiltre = boites.filter((boite) => {

            const villeOk =
                ville === "Toutes les villes"
                || boite.location.location_name === ville;

            const musiqueOk =
                musique === "Toutes les musiques"
                || boite.musique === musique;

            return villeOk && musiqueOk;
        });
        if (resultatFiltre.length === 0) {
            document.querySelector(".carroussel").textContent =
                "<p>Aucune boîte ne correspond à votre recherche.</p>";

            document.querySelector(".dots").innerHTML = "";

            return;
        };
        renderCards(resultatFiltre);
        refreshCarrousel();

    });

};


function addition(a, b) {
    a + b;
};
let resultat = addition(1 + 2);