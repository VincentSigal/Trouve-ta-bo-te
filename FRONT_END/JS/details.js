import { boites } from "../data/data_cards.js";
import { init_overlay } from "./overlay.js";
import { init_burger } from "./burger.js";
import { init_newsletter } from "./newsletter.js";
import { scrollHeader } from "./header.js";


document.addEventListener("DOMContentLoaded", () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    detailsPage();
});

function detailsPage() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const boite = boites.find(
        boite => boite.idClub === id
    );
    if (!boite) {
        console.error("Boîte introuvable");
        return;
    }
    const main_container = document.querySelector(`main`);
    let details_html = `
            <img class="logo_banniere" src="${boite.logo.logo_img}" alt="${boite.logo.logo_alt}">
            <section class="info_boite">
                <div class="musique_age_media">
                    <section class="musique_boite">
                        <p>Musique:</p>
                        <p>${boite.music}</p>
                    </section>
                    <section class="age_boite">
                        <p>Âge:</p>
                        <p>${boite.age} ans</p>
                    </section>
                </div>
                <section class="horaires_boite">
                    <div class="prix_boite">
                        <p>Prix:</p>
                        <p>${boite.price}</p>
                    </div>
                    <div class="ligneboite"></div>
                    <div class="detail_horaires">
                        <p>Horaires:</p>
                        <p>${boite.hours.time}</p>
                        <p>${boite.hours.date}</p>
                    </div>
                    <a class="preventes" href="#" title="Préventes">Préventes</a>
                </section>
            </section>
            <div class="ligne_div_details">
                <div class="ligne_details"></div>
                <img src="/FRONT_END/img/logo.png" alt="Logo Trouve ta boîte">
                <div class="ligne_details"></div>
            </div>
            <section class="main_detail">
                <article class="detail_left">
                    <h1>${boite.summary.heading}</h1>
                    <p>${boite.summary.paragraph}</p>
                </article>
                <div class="detail_right">
                    <img src="${boite.img.photos[0]}" alt="${boite.img.photos_alt}">
                    <img src="${boite.img.photos[1]}" alt="${boite.img.photos_alt}">
                    <img src="${boite.img.photos[2]}" alt="${boite.img.photos_alt}">
                </div>
            </section>
            <div class="ligne_div_details">
                <div class="ligne_details"></div>
                <img src="/FRONT_END/img/logo.png" alt="Logo Trouve ta boîte">
                <div class="ligne_details"></div>
            </div>
            <address><a href="${boite.adress.adress_link}">${boite.adress.adress_name}</a></address>
            <iframe src="${boite.adress.maps}"></iframe>`;

    main_container.innerHTML = details_html;
};