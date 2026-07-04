import { scrollHeader } from "./header.js";

import { init_newsletter } from "./newsletter.js";
import { init_burger } from "./burger.js";
import { init_overlay } from "./overlay.js";

import { init_carrousel } from "./carousel_homepage.js";
import { renderCards } from "./cards_boites.js";
import { init_filter, remplirFiltres } from "./filter.js";

const NOMBRE_BOITES_POPULAIRES = 10;

document.addEventListener("DOMContentLoaded", async () => {

    init_overlay();
    init_burger();

    // L'API renvoie déjà les boîtes triées par popularité (clicks)
    const reponse = await fetch("http://localhost:3000/api/boites");
    const boites = await reponse.json();

    const boitesPopulaires = boites.slice(0, NOMBRE_BOITES_POPULAIRES);

    remplirFiltres(boites);
    renderCards(boitesPopulaires);

    init_newsletter();
    scrollHeader();
    init_carrousel();
    init_filter(boites);
});