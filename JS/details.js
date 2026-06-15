import { boites } from "../data/data_cards.js";

function detailsPage() {

    const main_container = document.querySelector(`main`);
    let details_html = ``;

    boites.forEach((details) => {
        details_html += `
        <img class="logo_banniere" src="${details_html.logo[0]}" alt="${details_html.logo[1]}">
            <section class="info_boite">
                <div class="musique_age_media">
                    <section class="musique_boite">
                        <p>Musique:</p>
                        <p>${details_html.music}</p>
                    </section>
                    <section class="age_boite">
                        <p>Âge:</p>
                        <p>${details_html.age}</p>
                    </section>
                </div>
                <section class="horaires_boite">
                    <div class="prix_boite">
                        <p>Prix:</p>
                        <p>${details_html.price}</p>
                    </div>
                    <div class="ligneboite"></div>
                    <div class="detail_horaires">
                        <p>Horaires:</p>
                        <p>${details_html.hours[0]}</p>
                        <p>${details_html.hours[1]}</p>
                    </div>
                    <a class="preventes" href="#" title="Préventes">Préventes</a>
                </section>
            </section>
            <div class="ligne_div_details">
                <div class="ligne_details"></div>
                <img src="/img/logo.png" alt="Logo Trouve ta boîte">
                    <div class="ligne_details"></div>
            </div>
            <section class="main_detail">
                <article class="detail_left">
                    <h1>${details_html.summary[0]}</h1>
                    <p>${details_html.summary[0]}</p>
                </article>
                <div class="detail_right">
                    <img src="${details_html.img.photos[0]}" alt="${details_html.img.photos_alt}">
                        <img src="${details_html.img.photos[1]}" alt="${details_html.img.photos_alt}">
                            <img src="${details_html.img.photos[2]}" alt="${details_html.img.photos_alt}">
                            </div>
                        </section>
                        <div class="ligne_div_details">
                            <div class="ligne_details"></div>
                            <img src="/img/logo.png" alt="Logo Trouve ta boîte">
                                <div class="ligne_details"></div>
                        </div>
                        <address><a href="${details_html.adress[0]}">${details_html.adress[1]}</a></address>
                        <iframe
                            src="${details_html.summary[2]}"></iframe>
                    </main>`;
    });
};