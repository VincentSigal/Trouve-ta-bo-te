import { init_overlay } from "./overlay.js";
import { init_burger } from "./burger.js";
import { init_cards } from "./cards_boites.js";
import { init_newsletter } from "./newsletter.js";
import { scrollHeader } from "./header.js";

document.addEventListener("DOMContentLoaded", () => {

    init_overlay();
    init_burger();
    init_cards();
    init_newsletter();
    scrollHeader();
});