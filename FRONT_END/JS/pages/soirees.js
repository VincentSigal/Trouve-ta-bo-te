/* ==========================
   PAGE SOIRÉES
   Affiche un calendrier de 14 jours
   avec les soirées à venir, des filtres,
   et une popup "voir plus"
   ========================== */

import { init_overlay, show_overlay, close_overlay, on_overlay_click } from "../components/overlay.js";
import { init_burger } from "../components/burger.js";
import { init_newsletter } from "../components/newsletter.js";
import { scrollHeader, initBoutonEspacePro } from "../components/header.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1/+esm";

// Liste des 14 jours, générée une seule fois
// au chargement de la page (toujours à jour
// par rapport à la date du jour)
let jours14 = [];

// Toutes les soirées récupérées depuis l'API
let events = [];

// Liste des événements après application
// des filtres (par défaut = tous)
let evenementsAffiches = [];

document.addEventListener("DOMContentLoaded", async () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    initBoutonEspacePro();

    const reponse = await fetch("http://localhost:3000/api/events");
    events = await reponse.json();

    // L'API renvoie une seule colonne "date_" combinant
    // date et heure (ex: "2026-07-20 22:00:00"). On sépare
    // les deux pour garder le reste du code inchangé.
    events.forEach((event) => {
        const [datePart, heurePart] = event.date_.split(" ");
        event.date = datePart;
        event.heure = heurePart.slice(0, 5);
    });

    evenementsAffiches = events;

    jours14 = creerListeDe14Jours();

    remplirFiltres();
    afficherCalendrier(evenementsAffiches);

    initFiltres();
    initBoutonVoirToutesLesSoirees();
    initClicsPopularite();
});


/* ==========================
   GÉNÉRATION DES 14 JOURS
   ========================== */

function creerListeDe14Jours() {

    const liste = [];

    for (let i = 0; i < 14; i++) {

        const dateFormatee = dayjs().add(i, "day").format("YYYY-MM-DD");

        liste.push(dateFormatee);
    }

    return liste;
};


/* ==========================
   NOM DU JOUR ET DU MOIS
   (pour l'affichage uniquement)
   ========================== */

function formaterJourAffiche(dateString) {

    const joursTexte = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const moisTexte = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

    // On force midi pour éviter tout décalage de fuseau horaire
    // lors du parsing d'une date seule (sans heure)
    const date = dayjs(`${dateString}T12:00:00`);

    const nomJour = joursTexte[date.day()];
    const numeroJour = date.date();
    const nomMois = moisTexte[date.month()];

    return { nomJour, numeroJour, nomMois };
};


/* ==========================
   AFFICHAGE DU CALENDRIER
   ========================== */

function afficherCalendrier(listeEvenements) {

    const grid = document.querySelector("#calendarGrid");

    let grid_html = ``;

    jours14.forEach((jourActuel) => {

        const { nomJour, numeroJour, nomMois } = formaterJourAffiche(jourActuel);

        const evenementsDuJour = listeEvenements.filter((event) => event.date === jourActuel);

        let cards_html = ``;

        if (evenementsDuJour.length > 0) {

            const LIMITE_PAR_JOUR = 3;

            const evenementsAMontrer = evenementsDuJour.slice(0, LIMITE_PAR_JOUR);
            const nombreEnPlus = evenementsDuJour.length - LIMITE_PAR_JOUR;

            evenementsAMontrer.forEach((event) => {

                cards_html += `
                    <div class="event-card" data-id="${event.idEvent}" data-idclub="${event.idClub}">
                        <img src="${event.poster}" alt="${event.name}">
                        <div class="event-card-info">
                            <p class="event-card-name">${event.name}</p>
                            <p class="event-card-boite">${event.boite_name}</p>
                        </div>
                    </div>`;
            });

            if (nombreEnPlus > 0) {

                cards_html += `
                    <button class="voir-plus-jour" data-jour="${jourActuel}">
                        + ${nombreEnPlus} autre${nombreEnPlus > 1 ? "s" : ""}
                    </button>`;
            }

        } else {

            cards_html = `<p class="no-event">Aucune soirée</p>`;
        }

        grid_html += `
            <div class="day-column">
                <div class="day-header">
                    <p class="day-name">${nomJour}</p>
                    <p class="day-number">${numeroJour}</p>
                    <p class="day-month">${nomMois}</p>
                </div>
                <div class="day-events">
                    ${cards_html}
                </div>
            </div>`;
    });

    grid.innerHTML = grid_html;

    initClicsSurCartes();
    initBoutonsVoirPlusParJour();
};


/* ==========================
   "+ X AUTRES" SUR UN JOUR PRÉCIS
   ========================== */

function initBoutonsVoirPlusParJour() {

    const boutons = document.querySelectorAll(".voir-plus-jour");

    boutons.forEach((bouton) => {

        bouton.addEventListener("click", () => {

            const jourClique = bouton.dataset.jour;

            const evenementsDuJour = evenementsAffiches.filter((event) => event.date === jourClique);

            const { nomJour, numeroJour, nomMois } = formaterJourAffiche(jourClique);
            const titre = `Soirées du ${nomJour} ${numeroJour} ${nomMois}`;

            afficherPopupListe(evenementsDuJour, titre);
        });
    });
};


/* ==========================
   FILTRES : REMPLISSAGE DES SELECTS
   ========================== */

function remplirFiltres() {

    const selectBoite = document.querySelector("#filterBoite");
    const selectMusique = document.querySelector("#filterMusique");

    // Boîtes uniques ayant au moins une soirée
    const clubsUniques = [];

    events.forEach((event) => {

        const dejaPresent = clubsUniques.some((club) => club.idClub === event.idClub);

        if (dejaPresent === false) {
            clubsUniques.push({ idClub: event.idClub, name: event.boite_name });
        }
    });

    clubsUniques.forEach((club) => {

        selectBoite.insertAdjacentHTML("beforeend", `
            <option value="${club.idClub}">${club.name}</option>`);
    });

    // Styles musicaux uniques
    const stylesUniques = [];

    events.forEach((event) => {

        const dejaPresent = stylesUniques.includes(event.music_name);

        if (dejaPresent === false) {
            stylesUniques.push(event.music_name);
        }
    });

    stylesUniques.forEach((style) => {

        selectMusique.insertAdjacentHTML("beforeend", `
            <option value="${style}">${style}</option>`);
    });
};


/* ==========================
   FILTRES : APPLICATION
   ========================== */

function initFiltres() {

    const selectBoite = document.querySelector("#filterBoite");
    const selectMusique = document.querySelector("#filterMusique");
    const btnReset = document.querySelector("#btnReset");

    selectBoite.addEventListener("change", appliquerFiltres);
    selectMusique.addEventListener("change", appliquerFiltres);

    btnReset.addEventListener("click", () => {

        selectBoite.selectedIndex = 0;
        selectMusique.selectedIndex = 0;

        evenementsAffiches = events;
        afficherCalendrier(evenementsAffiches);
    });
};

function appliquerFiltres() {

    const selectBoite = document.querySelector("#filterBoite");
    const selectMusique = document.querySelector("#filterMusique");

    const valeurBoite = selectBoite.value;
    const valeurMusique = selectMusique.value;

    let resultat = events;

    if (valeurBoite !== "") {

        resultat = resultat.filter((event) => event.idClub === Number(valeurBoite));
    }

    if (valeurMusique !== "") {

        resultat = resultat.filter((event) => event.music_name === valeurMusique);
    }

    evenementsAffiches = resultat;
    afficherCalendrier(evenementsAffiches);
};


/* ==========================
   POPUP "LISTE DE SOIRÉES"
   (utilisée pour "voir toutes les soirées"
   ET pour le "+ X autres" d'un jour précis)
   ========================== */

function afficherPopupListe(listeEvenements, titre) {

    const popup = document.querySelector("#eventsPopup");
    const grid = document.querySelector("#eventsPopupGrid");
    const titrePopup = document.querySelector("#eventsPopup h2");
    const btnClose = document.querySelector("#btnCloseEventsPopup");

    titrePopup.textContent = titre;

    let grid_html = ``;

    listeEvenements.forEach((event) => {

        const { nomJour, numeroJour, nomMois } = formaterJourAffiche(event.date);

        grid_html += `
            <div class="event-card" data-id="${event.idEvent}" data-idclub="${event.idClub}">
                <img src="${event.poster}" alt="${event.name}">
                <div class="event-card-info">
                    <p class="event-card-date">${nomJour} ${numeroJour} ${nomMois}</p>
                    <p class="event-card-name">${event.name}</p>
                    <p class="event-card-boite">${event.boite_name}</p>
                </div>
            </div>`;
    });

    grid.innerHTML = grid_html;

    // Affiche la popup et l'overlay
    popup.classList.add("active");
    show_overlay();

    // Ferme cette popup au clic sur la croix
    btnClose.addEventListener("click", () => {
        popup.classList.remove("active");
        close_overlay();
    });

    // Ferme cette popup au clic sur l'overlay
    on_overlay_click(() => {
        popup.classList.remove("active");
        close_overlay();
    });

    initClicsSurCartes();
};


function initBoutonVoirToutesLesSoirees() {

    const btnVoirPlus = document.querySelector("#btnVoirPlus");

    btnVoirPlus.addEventListener("click", () => {

        const evenementsTries = [...events].sort((a, b) => a.date.localeCompare(b.date));

        afficherPopupListe(evenementsTries, "Toutes les soirées");
    });
};


/* ==========================
   POPULARITÉ : INCRÉMENTE LE COMPTEUR DE CLICS
   DE LA BOÎTE QUAND ON CLIQUE SUR UNE DE SES SOIRÉES
   Posé une seule fois sur document (délégation),
   pour fonctionner même quand les cartes sont
   reconstruites (calendrier, popup "voir plus").
   ========================== */

function initClicsPopularite() {

    document.addEventListener("click", (event) => {

        const carte = event.target.closest(".event-card[data-idclub]");

        if (carte === null) {
            return;
        }

        const idClub = carte.dataset.idclub;

        fetch(`http://localhost:3000/api/boites/${idClub}/click`, { method: "POST" });
    });
};


/* ==========================
   POPUP DÉTAIL D'UNE SOIRÉE
   ========================== */

function initClicsSurCartes() {

    const cartes = document.querySelectorAll(".event-card");

    cartes.forEach((carte) => {

        carte.addEventListener("click", () => {

            const idEvent = Number(carte.dataset.id);

            const event = events.find((e) => e.idEvent === idEvent);

            afficherPopupDetail(event);
        });
    });
};

function afficherPopupDetail(event) {

    const popup = document.querySelector("#eventDetailPopup");
    const listePopup = document.querySelector("#eventsPopup");

    const { nomJour, numeroJour, nomMois } = formaterJourAffiche(event.date);

    const prixAffiche = event.price !== null ? `${event.price}€` : "Gratuit";

    popup.innerHTML = `
        <div class="event-detail-content">
            <button class="event-detail-close" id="btnCloseDetail">&times;</button>
            <img src="${event.poster}" alt="${event.name}">
            <h2>${event.name}</h2>
            <p class="event-detail-boite">${event.boite_name} — ${event.city_name}</p>
            <p class="event-detail-date">${nomJour} ${numeroJour} ${nomMois} à ${event.heure}</p>
            <p class="event-detail-prix">${prixAffiche}</p>
            <p class="event-detail-description">${event.description}</p>
        </div>`;

    // Affiche la popup détail et l'overlay
    // (si l'overlay était déjà affiché pour une autre
    // popup en dessous, ça ne change rien, il reste affiché)
    popup.classList.add("active");
    show_overlay();

    // Si la liste de soirées est ouverte en dessous,
    // on l'assombrit légèrement pour bien mettre en
    // avant la popup détail qui passe par-dessus
    const listeEstOuverte = listePopup.classList.contains("active");

    if (listeEstOuverte === true) {
        listePopup.classList.add("assombrie");
    }

    const btnCloseDetail = document.querySelector("#btnCloseDetail");

    // Ferme cette popup au clic sur sa croix
    btnCloseDetail.addEventListener("click", () => {
        fermerPopupDetail(popup, listePopup);
    });

    // Ferme cette popup au clic sur l'overlay
    on_overlay_click(() => {
        fermerPopupDetail(popup, listePopup);
    });
};

function fermerPopupDetail(popup, listePopup) {

    popup.classList.remove("active");

    // On retire l'assombrissement de la liste,
    // qu'elle soit ouverte ou pas
    listePopup.classList.remove("assombrie");

    // Si la liste de soirées est encore ouverte en dessous,
    // on garde l'overlay affiché pour elle
    const listeEstOuverte = listePopup.classList.contains("active");

    if (listeEstOuverte === false) {
        close_overlay();
    }
};
