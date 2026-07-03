import { boites } from "../data/data_cards.js";

import { scrollHeader } from "./header.js";

import { init_newsletter } from "./newsletter.js";
import { init_burger } from "./burger.js";
import { init_overlay } from "./overlay.js";

import { init_carrousel } from "./carousel_homepage.js";
import { renderCards } from "./cards_boites.js";
import { init_filter, remplirFiltres } from "./filter.js";

document.addEventListener("DOMContentLoaded", () => {

    init_overlay();
    init_burger();
    remplirFiltres();
    renderCards(boites);
    init_newsletter();
    scrollHeader();
    init_carrousel();
    init_filter();
});