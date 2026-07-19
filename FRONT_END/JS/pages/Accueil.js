import { scrollHeader, initBoutonEspacePro } from "../components/header.js";

import { init_newsletter } from "../components/newsletter.js";
import { init_burger } from "../components/burger.js";
import { init_overlay } from "../components/overlay.js";

import { init_carrousel } from "../components/carousel_homepage.js";
import { renderCards } from "../components/cards_boites.js";
import { init_filter, remplirFiltres } from "../components/filter.js";

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
    initBoutonEspacePro();
    init_carrousel();
    init_filter(boites);
});