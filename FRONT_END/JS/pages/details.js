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
    detailsPage();
});

async function detailsPage() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const reponse = await fetch(`http://localhost:3000/api/boites/${id}`);

    if (reponse.ok === false) {
        console.error("Boîte introuvable");
        return;
    }

    const boite = await reponse.json();

    // Titre + description de l'onglet, mis à jour dynamiquement
    document.title = `${boite.name} | Trouve ta boîte`;

    const horaires = formatHoraires(boite.horaires);

    let photos_html = ``;
    boite.photos.slice(0, 3).forEach((photo) => {
        photos_html += `<img src="${photo.urlPhoto}" alt="${photo.photo_name}">`;
    });

    const main_container = document.querySelector(`main`);
    let details_html = `
            <img class="logo_banniere" src="${boite.logo}" alt="${boite.name}">
            <section class="info_boite">
                <div class="musique_age_media">
                    <section class="musique_boite">
                        <p>Musique:</p>
                        <p>${boite.music_name}</p>
                    </section>
                    <section class="age_boite">
                        <p>Âge:</p>
                        <p>${boite.age_min} - ${boite.age_max} ans</p>
                    </section>
                </div>
                <section class="horaires_boite">
                    <div class="prix_boite">
                        <p>Prix:</p>
                        <p>${boite.price}€</p>
                    </div>
                    <div class="ligneboite"></div>
                    <div class="detail_horaires">
                        <p>Horaires:</p>
                        <p>${horaires.time}</p>
                        <p>${horaires.date}</p>
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
                    <h1>${boite.name}</h1>
                    <p>${boite.paragraph}</p>
                </article>
                <div class="detail_right">
                    ${photos_html}
                </div>
            </section>
            <div class="ligne_div_details">
                <div class="ligne_details"></div>
                <img src="/FRONT_END/img/logo.png" alt="Logo Trouve ta boîte">
                <div class="ligne_details"></div>
            </div>
            <address><a href="${boite.location_link}">${boite.adress_name}</a></address>
            <iframe src="${boite.maps_iframe}"></iframe>`;

    main_container.innerHTML = details_html;
};


/* ==========================
   FORMATE LES HORAIRES
   La base stocke une ligne par jour d'ouverture. On regroupe
   les jours ensemble, et on affiche la plage horaire de la
   première ligne (elles sont identiques pour une même boîte).
   ========================== */

function formatHoraires(horaires) {

    if (horaires.length === 0) {
        return { time: "Horaires non renseignés", date: "" };
    }

    const premiereLigne = horaires[0];
    const heureOuverture = premiereLigne.opening_hours.slice(0, 5);
    const heureFermeture = premiereLigne.closing_hours.slice(0, 5);

    const jours = horaires.map((ligne) => ligne.day).join(", ");

    return {
        time: `${heureOuverture} - ${heureFermeture}`,
        date: jours
    };
}
