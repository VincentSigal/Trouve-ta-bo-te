import { init_overlay } from "../components/overlay.js";
import { init_burger } from "../components/burger.js";
import { init_newsletter } from "../components/newsletter.js";
import { scrollHeader, initBoutonEspacePro } from "../components/header.js";


document.addEventListener("DOMContentLoaded", () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    initBoutonEspacePro();
});