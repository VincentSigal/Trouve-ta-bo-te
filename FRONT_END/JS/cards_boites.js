/* ==========================
   AFFICHAGE DES CARTES
   ========================== */

// Fonctions de gestion de l'overlay
import { show_overlay, close_overlay, on_overlay_click } from "./overlay.js";


// Génère dynamiquement les cartes
// à partir des données reçues
export function renderCards(data) {

    // Conteneur qui recevra les cartes
    const cards_container = document.querySelector(`.carousel-track`);

    // Chaîne HTML qui contiendra
    // toutes les cartes générées
    let boites_html = ``;

    // Parcourt chaque boîte de nuit
    // pour construire son HTML
    data.forEach((boites_js) => {
        boites_html += `
                    <section class="card">
                        <div class="bgcard" style="background-image:url(${boites_js.background})">
                            <div>
                                <h3>${boites_js.name}</h3>
                                <address><a href="${boites_js.location_link}" target="_blank"
                                        title="${boites_js.city_name}">${boites_js.city_name}</a></address>
                            </div>
                            <div>
                                <p>#${boites_js.tags1}</p>
                                <p>#${boites_js.tags2}</p>
                                <div class="popdesc">
                                    <p>${boites_js.description}</p>
                                    <a href="/FRONT_END/HTML/Details_boite.html?id=${boites_js.idClub}" title="Voir plus de détails">Voir plus de détails</a>
                                </div>
                            </div>
                        </div>
                    </section>`;
    });

    // Injecte toutes les cartes
    // dans le carrousel
    cards_container.innerHTML = boites_html;


    /* ==========================
   POPUP DES CARTES
   ========================== */

    const cards_popup = document.querySelectorAll(`.card`);

    // Conteneur de la popup
    const popup = document.querySelector(".club-popup-card");

    // Ajoute un clic sur chaque carte
    cards_popup.forEach((event_cards) => {

        // Ouvre la popup contenant
        // les détails de la carte
        event_cards.addEventListener("click", () => {


            // Empêche l'ouverture de la popup
            // lorsqu'un drag du carrousel est en cours
            const carrousel = document.querySelector(".carousel-track");
            if (carrousel.classList.contains("dragging")) {
                return;
            };

            // outerHTML copie l'élément complet
            // (balise + contenu) afin de recréer
            // la carte dans la popup
            popup.innerHTML = event_cards.outerHTML;

            // Récupère la carte nouvellement créée
            // à l'intérieur de la popup
            const popupCard = popup.querySelector(".card");

            popupCard.classList.add("popcard");

            popup.classList.add("active");

            show_overlay();

            // Ferme la popup lorsqu'on clique dessus
            popupCard.addEventListener("click", () => {

                popup.classList.remove("active");

                close_overlay();
            });
        });
    });

    // Ferme également la popup
    // lorsqu'on clique sur l'overlay
    on_overlay_click(() => {

        popup.classList.remove("active");

        close_overlay();
    });
};