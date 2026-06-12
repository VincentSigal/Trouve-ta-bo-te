/* INTEGRER CARDS BOITES DE NUIT */
import { boites } from "../data/data_cards.js";
import { show_overlay, close_overlay, on_overlay_click } from "./overlay.js";

export function renderCards(data) {
    const cards_container = document.querySelector(`.carousel-track`);
    let boites_html = ``;
    data.forEach((boites_js) => {
        boites_html += `
                    <section class="card">
                        <div class="bgcard" style="background-image:url(${boites_js.background})">
                            <div>
                                <h3>${boites_js.name}</h3>
                                <address><a href="${boites_js.location.location_link}" target="_blank"
                                        title="${boites_js.location.location_name}">${boites_js.location.location_name}</a></address>
                            </div>
                            <div>
                                <p>#${boites_js.tags[0]}</p>
                                <p>#${boites_js.tags[1]}</p>
                                <div class="popdesc">
                                    <p>${boites_js.description}</p>
                                    <a href="${boites_js.details}" title="Voir plus de détails">Voir plus de détails</a>
                                </div>
                            </div>
                        </div>
                    </section>`;
    });
    cards_container.innerHTML = boites_html;

    /* POP UP CARDS BOITES DE NUIT */
    const cards_popup = document.querySelectorAll(`.card`);
    const popup = document.querySelector(".club-popup-card");

    cards_popup.forEach((event_cards) => {

        event_cards.addEventListener("click", () => {

            const carrousel = document.querySelector(".carousel-track");
            if (carrousel.classList.contains("dragging")) {
                return;
            };

            popup.innerHTML = event_cards.outerHTML;

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