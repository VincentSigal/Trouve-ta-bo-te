/* ==========================
   ESPACE PRO — TABLEAU DE BORD
   Gestion des boîtes et soirées du pro connecté.

   Architecture du fichier :
   0. Protection de l'accès (JWT)
   1. Chargement des données depuis l'API
   2. Rendu des cartes
   3. Modale (formulaire ajout / modification)
   4. Actions CRUD (Créer, Modifier, Supprimer)
   5. Écouteurs d'événements
   6. Initialisation
   ========================== */

import { scrollHeader, initBoutonEspacePro } from "../components/header.js";
import { init_newsletter } from "../components/newsletter.js";
import { init_burger } from "../components/burger.js";
import { init_overlay } from "../components/overlay.js";

const API_URL = "http://localhost:3000/api";


/* ─────────────────────────────────────
   0. PROTECTION DE L'ACCÈS

   Le token peut être dans localStorage (connexion
   "dont se souvenir") ou sessionStorage (sinon).
   S'il n'y en a nulle part, la personne n'est pas
   connectée : on la renvoie direct vers la connexion.
───────────────────────────────────── */

const token = localStorage.getItem("token") || sessionStorage.getItem("token");
const utilisateurConnecte = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

if (token === null) {
    window.location.href = "/FRONT_END/HTML/connexion_pro.html";
}


/* ─────────────────────────────────────
   1. CHARGEMENT DES DONNÉES DEPUIS L'API

   On récupère TOUTES les boîtes et TOUTES les soirées,
   puis on ne garde que celles qui appartiennent à la
   personne connectée (peu de données au total, donc
   filtrer côté navigateur reste très bien pour ce projet).
───────────────────────────────────── */

let boites = [];
let soirees = [];

async function chargerDonnees() {

    const [reponseBoites, reponseEvents] = await Promise.all([
        fetch(`${API_URL}/boites`),
        fetch(`${API_URL}/events`)
    ]);

    const toutesLesBoites = await reponseBoites.json();
    const toutesLesSoirees = await reponseEvents.json();

    boites = toutesLesBoites.filter((boite) => boite.idUser === utilisateurConnecte.idUser);

    const idsDeMesBoites = boites.map((boite) => boite.idClub);
    soirees = toutesLesSoirees.filter((soiree) => idsDeMesBoites.includes(soiree.idClub));
}


/* ─────────────────────────────────────
   2. RENDU DES CARTES
───────────────────────────────────── */

function renderBoites() {
    const boitesList = document.querySelector("#boitesList");

    if (boites.length === 0) {
        boitesList.innerHTML = `
            <p class="pro-list-empty">
                Vous n'avez pas encore ajouté de boîte.
            </p>`;
        return;
    }

    boitesList.innerHTML = boites
        .map((boite) => templateCarteBoite(boite))
        .join("");
}

function renderSoirees() {
    const soireesList = document.querySelector("#soireesList");

    if (soirees.length === 0) {
        soireesList.innerHTML = `
            <p class="pro-list-empty">
                Vous n'avez pas encore ajouté de soirée.
            </p>`;
        return;
    }

    soireesList.innerHTML = soirees
        .map((soiree) => templateCarteSoiree(soiree))
        .join("");
}

function templateCarteBoite(boite) {
    return `
        <article class="pro-card">
            <div class="pro-card-img"
                style="background-image: url('${boite.background || ""}');">
            </div>
            <div class="pro-card-body">
                <h3 class="pro-card-name">${boite.name}</h3>
                <p class="pro-card-sub">📍 ${boite.city_name || "Ville non renseignée"} · 🎵 ${boite.music_name || "Style non renseigné"}</p>
                <p class="pro-card-desc">${boite.description || ""}</p>
            </div>
            <div class="pro-card-actions">
                <button class="btn-edit" data-id="${boite.idClub}">Modifier</button>
                <button class="btn-delete" data-id="${boite.idClub}">Supprimer</button>
            </div>
        </article>`;
}

function templateCarteSoiree(soiree) {
    // On retrouve la boîte associée pour afficher son nom
    const boite = boites.find((b) => b.idClub === soiree.idClub);
    const nomBoite = boite ? boite.name : "Boîte introuvable";

    const dateHeure = formaterDateHeure(soiree.date_);
    const prixAffiche = soiree.price !== null ? `${soiree.price}€` : "Gratuit";

    return `
        <article class="pro-card">
            <div class="pro-card-img"
                style="background-image: url('${soiree.poster || ""}');">
            </div>
            <div class="pro-card-body">
                <h3 class="pro-card-name">${soiree.name}</h3>
                <p class="pro-card-sub">📅 ${dateHeure}</p>
                <p class="pro-card-sub">💰 ${prixAffiche} · 🏠 ${nomBoite} · 🎵 ${soiree.music_name || "Style non renseigné"}</p>
                <p class="pro-card-desc">${soiree.description || ""}</p>
            </div>
            <div class="pro-card-actions">
                <button class="btn-edit" data-id="${soiree.idEvent}">Modifier</button>
                <button class="btn-delete" data-id="${soiree.idEvent}">Supprimer</button>
            </div>
        </article>`;
}

// L'API renvoie une seule colonne date_ (ex: "2026-07-20 22:00:00"),
// grâce à dateStrings:true côté backend, donc un simple découpage
// de texte suffit — pas besoin de manipuler des objets Date ici.
function formaterDateHeure(date_) {
    const [datePart, heurePart] = date_.split(" ");
    const [annee, mois, jour] = datePart.split("-");
    const heure = heurePart.slice(0, 5);

    return `${jour}/${mois}/${annee} à ${heure}`;
}


/* ─────────────────────────────────────
   3. MODALE

   Une seule modale réutilisée pour les 4 cas :
   - Ajouter une boîte
   - Modifier une boîte
   - Ajouter une soirée
   - Modifier une soirée

   On injecte les bons champs de formulaire
   selon le contexte, et on passe une fonction
   "onSubmit" qui sait quoi faire avec les données.
───────────────────────────────────── */

// Injection de la modale dans la page (une seule fois)
document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <button class="modal-close" id="modalClose" aria-label="Fermer">✕</button>
            <h3 class="modal-title" id="modalTitle"></h3>
            <form class="modal-form" id="modalForm"></form>
        </div>
    </div>
`);

// On stocke la référence du gestionnaire de soumission
// pour pouvoir le retirer avant d'en ajouter un nouveau,
// et éviter qu'il se cumule à chaque ouverture de modale
let soumettreFormulaire = null;

function ouvrirModale(titre, champsHTML, onSubmit) {
    const modalOverlay = document.querySelector("#modalOverlay");
    const modalTitle = document.querySelector("#modalTitle");
    const modalForm = document.querySelector("#modalForm");

    modalTitle.textContent = titre;
    modalForm.innerHTML = champsHTML;

    // Suppression de l'ancien gestionnaire avant d'en ajouter un nouveau
    if (soumettreFormulaire) {
        modalForm.removeEventListener("submit", soumettreFormulaire);
    }

    soumettreFormulaire = (e) => {
        e.preventDefault();

        // FormData lit automatiquement tous les champs du formulaire
        // par leur attribut "name" — pratique et moderne
        const donnees = new FormData(e.currentTarget);
        onSubmit(donnees);
    };

    modalForm.addEventListener("submit", soumettreFormulaire);
    modalOverlay.classList.add("modal-visible");
}

function fermerModale() {
    document.querySelector("#modalOverlay").classList.remove("modal-visible");
}

// Champs HTML du formulaire Boîte (pré-remplis si modification).
// city_name/music_name viennent directement de l'API (jointures),
// donc on peut préremplir les champs texte "city"/"music" avec.
function champsBoite(boite = {}) {
    return `
        <label>Nom de la boîte *
            <input type="text" name="name"
                value="${boite.name || ""}" required>
        </label>
        <label>SIRET *
            <input type="text" name="siret"
                value="${boite.siret || ""}" required>
        </label>
        <label>Ville *
            <input type="text" name="city"
                value="${boite.city_name || ""}" required>
        </label>
        <label>Style musical *
            <input type="text" name="music"
                placeholder="Ex : Techno, Open Format…"
                value="${boite.music_name || ""}" required>
        </label>
        <label>Description
            <textarea name="description" rows="3">${boite.description || ""}</textarea>
        </label>
        <label>Présentation détaillée
            <textarea name="paragraph" rows="3">${boite.paragraph || ""}</textarea>
        </label>
        <label>Tag 1
            <input type="text" name="tags1" value="${boite.tags1 || ""}">
        </label>
        <label>Tag 2
            <input type="text" name="tags2" value="${boite.tags2 || ""}">
        </label>
        <label>Âge minimum
            <input type="number" name="age_min" value="${boite.age_min ?? ""}">
        </label>
        <label>Âge maximum
            <input type="number" name="age_max" value="${boite.age_max ?? ""}">
        </label>
        <label>Prix d'entrée (€)
            <input type="number" name="price" value="${boite.price ?? ""}">
        </label>
        <label>Instagram (lien)
            <input type="text" name="instagram" value="${boite.instagram || ""}">
        </label>
        <label>Image de fond (URL)
            <input type="text" name="background"
                placeholder="/FRONT_END/img/…"
                value="${boite.background || ""}">
        </label>
        <label>Logo (URL)
            <input type="text" name="logo"
                placeholder="/FRONT_END/img/…"
                value="${boite.logo || ""}">
        </label>
        <label>Lien Google Maps
            <input type="text" name="location_link" value="${boite.location_link || ""}">
        </label>
        <label>Adresse (texte)
            <input type="text" name="adress_name" value="${boite.adress_name || ""}">
        </label>
        <label>Carte intégrée (URL de l'iframe Google Maps)
            <input type="text" name="maps_iframe" value="${boite.maps_iframe || ""}">
        </label>
        <div class="modal-btns">
            <button type="button" id="btnAnnuler" class="modal-btn-cancel">Annuler</button>
            <button type="submit" class="modal-btn-submit">Enregistrer</button>
        </div>`;
}

// Champs HTML du formulaire Soirée (pré-remplis si modification).
// Pas de champ "style musical" : la soirée reprend automatiquement
// celui de sa boîte, côté serveur.
function champsSoiree(soiree = {}) {
    // On génère les <option> depuis les boîtes du pro connecté
    const optionsBoites = boites
        .map((b) => `
            <option value="${b.idClub}" ${soiree.idClub === b.idClub ? "selected" : ""}>
                ${b.name}
            </option>`)
        .join("");

    let datePart = "";
    let heurePart = "";

    if (soiree.date_ !== undefined) {
        const decoupage = soiree.date_.split(" ");
        datePart = decoupage[0];
        heurePart = decoupage[1].slice(0, 5);
    }

    return `
        <label>Nom de la soirée *
            <input type="text" name="name"
                value="${soiree.name || ""}" required>
        </label>
        <label>Date *
            <input type="date" name="date"
                value="${datePart}" required>
        </label>
        <label>Heure *
            <input type="time" name="heure"
                value="${heurePart}" required>
        </label>
        <label>Prix d'entrée (€)
            <input type="number" name="price" value="${soiree.price ?? ""}">
        </label>
        <label>Style musical de la soirée
            <input type="text" name="music"
                placeholder="Laisser vide pour reprendre le style de la boîte"
                value="${soiree.music_name || ""}">
        </label>
        <label>Boîte associée *
            <select name="idClub" required>
                <option value="" disabled ${!soiree.idClub ? "selected" : ""}>
                    Choisir une boîte
                </option>
                ${optionsBoites}
            </select>
        </label>
        <label>Description
            <textarea name="description" rows="3">${soiree.description || ""}</textarea>
        </label>
        <label>URL du poster
            <input type="text" name="poster"
                placeholder="/FRONT_END/img/…"
                value="${soiree.poster || ""}">
        </label>
        <div class="modal-btns">
            <button type="button" id="btnAnnuler" class="modal-btn-cancel">Annuler</button>
            <button type="submit" class="modal-btn-submit">Enregistrer</button>
        </div>`;
}


/* ─────────────────────────────────────
   4. ACTIONS CRUD
   (Create / Update / Delete)

   Chaque action appelle l'API avec le token de la
   personne connectée, puis recharge les données
   depuis le serveur pour rester bien synchronisé.
───────────────────────────────────── */

// Petit raccourci pour les appels qui nécessitent d'être connecté
async function appelApiProtege(url, methode, corps) {
    const options = {
        method: methode,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    if (corps !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(corps);
    }

    const reponse = await fetch(url, options);
    const resultat = await reponse.json();

    if (reponse.ok === false) {
        throw new Error(resultat.error || "Une erreur est survenue");
    }

    return resultat;
}

// Convertit les champs numériques du formulaire (envoyés en texte
// par FormData) et remplace les champs vides par null
function nettoyerCorpsBoite(corps) {
    const champsNumeriques = ["age_min", "age_max", "price"];

    champsNumeriques.forEach((champ) => {
        corps[champ] = corps[champ] === "" ? null : Number(corps[champ]);
    });

    return corps;
}

// Combine les champs "date" + "heure" du formulaire en un seul
// champ "date_" (celui attendu par la table events)
function nettoyerCorpsSoiree(corps) {
    corps.date_ = `${corps.date} ${corps.heure}:00`;
    delete corps.date;
    delete corps.heure;

    corps.price = corps.price === "" ? null : Number(corps.price);
    corps.idClub = Number(corps.idClub);

    // Champ vide -> on ne l'envoie pas, pour que le serveur
    // reprenne automatiquement le style de la boîte associée
    if (corps.music === "") {
        delete corps.music;
    }

    return corps;
}

// ── BOÎTES ──

function ajouterBoite() {
    ouvrirModale("Ajouter une boîte", champsBoite(), async (donnees) => {

        const corps = nettoyerCorpsBoite(Object.fromEntries(donnees.entries()));

        try {
            await appelApiProtege(`${API_URL}/boites`, "POST", corps);

            await chargerDonnees();
            renderBoites();
            renderSoirees();
            fermerModale();

        } catch (err) {
            alert(err.message);
        }
    });
}

function modifierBoite(idClub) {
    const boite = boites.find((b) => b.idClub === idClub);
    if (boite === undefined) return;

    ouvrirModale("Modifier la boîte", champsBoite(boite), async (donnees) => {

        const corps = nettoyerCorpsBoite(Object.fromEntries(donnees.entries()));

        try {
            await appelApiProtege(`${API_URL}/boites/${idClub}`, "PATCH", corps);

            await chargerDonnees();
            renderBoites();
            // Les cartes soirées affichent le nom de la boîte,
            // donc on les recharge aussi si le nom a changé
            renderSoirees();
            fermerModale();

        } catch (err) {
            alert(err.message);
        }
    });
}

async function supprimerBoite(idClub) {
    const boite = boites.find((b) => b.idClub === idClub);
    if (boite === undefined) return;

    const confirme = confirm(
        `Supprimer "${boite.name}" ?\n\nAttention : les soirées liées à cette boîte seront également supprimées.`
    );
    if (confirme === false) return;

    try {
        await appelApiProtege(`${API_URL}/boites/${idClub}`, "DELETE");

        await chargerDonnees();
        renderBoites();
        renderSoirees();

    } catch (err) {
        alert(err.message);
    }
}

// ── SOIRÉES ──

function ajouterSoiree() {
    if (boites.length === 0) {
        alert("Ajoutez d'abord au moins une boîte avant de créer une soirée.");
        return;
    }

    ouvrirModale("Ajouter une soirée", champsSoiree(), async (donnees) => {

        const corps = nettoyerCorpsSoiree(Object.fromEntries(donnees.entries()));

        try {
            await appelApiProtege(`${API_URL}/events`, "POST", corps);

            await chargerDonnees();
            renderSoirees();
            fermerModale();

        } catch (err) {
            alert(err.message);
        }
    });
}

function modifierSoiree(idEvent) {
    const soiree = soirees.find((s) => s.idEvent === idEvent);
    if (soiree === undefined) return;

    ouvrirModale("Modifier la soirée", champsSoiree(soiree), async (donnees) => {

        const corps = nettoyerCorpsSoiree(Object.fromEntries(donnees.entries()));

        try {
            await appelApiProtege(`${API_URL}/events/${idEvent}`, "PATCH", corps);

            await chargerDonnees();
            renderSoirees();
            fermerModale();

        } catch (err) {
            alert(err.message);
        }
    });
}

async function supprimerSoiree(idEvent) {
    const soiree = soirees.find((s) => s.idEvent === idEvent);
    if (soiree === undefined) return;

    const confirme = confirm(`Supprimer "${soiree.name}" ? Cette action est irréversible.`);
    if (confirme === false) return;

    try {
        await appelApiProtege(`${API_URL}/events/${idEvent}`, "DELETE");

        await chargerDonnees();
        renderSoirees();

    } catch (err) {
        alert(err.message);
    }
}


/* ─────────────────────────────────────
   5. ÉCOUTEURS D'ÉVÉNEMENTS

   On utilise la "délégation d'événements" sur
   les conteneurs #boitesList et #soireesList.
   Plutôt que d'attacher un écouteur sur chaque
   bouton (qui sont créés et détruits dynamiquement),
   on écoute le clic sur le parent et on identifie
   le bouton ciblé avec event.target.closest().
───────────────────────────────────── */

function initEvenements() {

    // Boutons "+ Ajouter"
    document.querySelector("#btnAddBoite")
        .addEventListener("click", ajouterBoite);

    document.querySelector("#btnAddSoiree")
        .addEventListener("click", ajouterSoiree);

    // Délégation sur la liste des boîtes
    document.querySelector("#boitesList").addEventListener("click", (e) => {
        const btnEdit = e.target.closest(".btn-edit");
        const btnDelete = e.target.closest(".btn-delete");

        if (btnEdit !== null) modifierBoite(Number(btnEdit.dataset.id));
        if (btnDelete !== null) supprimerBoite(Number(btnDelete.dataset.id));
    });

    // Délégation sur la liste des soirées
    document.querySelector("#soireesList").addEventListener("click", (e) => {
        const btnEdit = e.target.closest(".btn-edit");
        const btnDelete = e.target.closest(".btn-delete");

        if (btnEdit !== null) modifierSoiree(Number(btnEdit.dataset.id));
        if (btnDelete !== null) supprimerSoiree(Number(btnDelete.dataset.id));
    });

    // Fermeture de la modale via le bouton ✕
    document.querySelector("#modalClose")
        .addEventListener("click", fermerModale);

    // Fermeture en cliquant sur le fond sombre
    // (mais pas si on clique à l'intérieur de la modale)
    // et fermeture via le bouton Annuler (délégation, car
    // ce bouton est injecté dynamiquement dans la modale)
    document.querySelector("#modalOverlay").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) fermerModale();
        if (e.target.id === "btnAnnuler") fermerModale();
    });

    // Déconnexion : on efface le token des deux stockages
    // possibles (peu importe lequel avait été utilisé)
    document.querySelector("#logoutBtn").addEventListener("click", () => {
        if (confirm("Voulez-vous vous déconnecter ?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            window.location.href = "/FRONT_END/HTML/connexion_pro.html";
        }
    });
}


/* ─────────────────────────────────────
   6. INITIALISATION
───────────────────────────────────── */

document.addEventListener("DOMContentLoaded", async () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    initBoutonEspacePro();

    if (utilisateurConnecte !== null) {
        const nomAffiche = utilisateurConnecte.firstName || utilisateurConnecte.email;
        document.querySelector("#dashboardGreeting").textContent = `Bonjour, ${nomAffiche}`;
    }

    await chargerDonnees();
    renderBoites();
    renderSoirees();
    initEvenements();
});