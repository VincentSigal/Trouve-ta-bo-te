import { boites } from "../data/data_cards.js";
import { renderCards } from "./cards_boites.js";
import { init_carrousel } from "./carrousel.js";

export function init_filter() {

    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");
    const filterBtn = document.querySelector("#btn-filter");

    filterBtn.addEventListener("click", () => {

        const ville = villeSelect.value;
        const musique = musiqueSelect.value;



        const resultatFiltre = boites.filter((boite) => {

            return boite.location.location_name === ville;

        });
        renderCards(resultatFiltre);
        const carrousel = document.querySelector(".carroussel");
        carrousel.style.transform = "translateX(0px)";
        init_carrousel();
    });
};