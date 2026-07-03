/* ==========================
   ESPACE PRO — TABLEAU DE BORD
   Gestion des boîtes et soirées du pro connecté.

   Architecture du fichier :
   1. Données et persistance (localStorage)
   2. Rendu des cartes
   3. Modale (formulaire ajout / modification)
   4. Actions CRUD (Créer, Modifier, Supprimer)
   5. Écouteurs d'événements
   6. Initialisation
   ========================== */


/* ─────────────────────────────────────
   1. DONNÉES ET PERSISTANCE

   localStorage permet de stocker des données
   dans le navigateur, même après rechargement.
   Il ne stocke que du texte, donc on convertit
   nos tableaux JS avec JSON.stringify() avant
   de les sauvegarder, et JSON.parse() pour les
   relire.

   Ces deux fonctions (charger / sauvegarder)
   seront les seules à remplacer quand on
   branchera le vrai backend Node/MySQL.
───────────────────────────────────── */

const CLE_BOITES = "espace_pro_boites";
const CLE_SOIREES = "espace_pro_soirees";

// Données factices initiales : utilisées uniquement
// à la toute première visite (localStorage vide)
const boitesInitiales = [
    {
        id: 2,
        name: "L'AMNESIA",
        ville: "Cap d'Agde",
        music: "Open Format",
        description: "Club emblématique du Cap d'Agde, réputé pour ses soirées Open Format jusqu'au bout de la nuit.",
        img: "/FRONT_END/img/amnesia/amnesia.png",
    },
    {
        id: 8,
        name: "Dieze Warehouse",
        ville: "Montpellier",
        music: "Techno",
        description: "L'adresse techno underground de Montpellier, dans un cadre industriel brut.",
        img: "/FRONT_END/img/dieze/dieze.jpg",
    },
];

const soireesInitiales = [
    {
        id: 1,
        name: "Soirée Ouverture de Saison",
        date: "2026-07-12",
        heure: "23h59",
        prix: "20€",
        description: "La soirée d'ouverture de saison à L'Amnesia, avec les meilleurs DJ pop du moment.",
        idBoite: 2,
        poster: "/FRONT_END/img/amnesia/amnesia.png",
    },
    {
        id: 2,
        name: "Techno Night",
        date: "2026-07-14",
        heure: "00h00",
        prix: "15€",
        description: "Une nuit entière dédiée à la techno underground, dans l'ambiance brute du Dieze Warehouse.",
        idBoite: 8,
        poster: "/FRONT_END/img/dieze/dieze.jpg",
    },
];

// Variables d'état : elles contiennent toujours
// la version la plus à jour des données en mémoire
let boites = [];
let soirees = [];

function chargerDonnees() {
    const boitesSauvegardees = localStorage.getItem(CLE_BOITES);
    const soireesSauvegardees = localStorage.getItem(CLE_SOIREES);

    // Si des données existent déjà → on les utilise
    // Sinon (1re visite) → on part des données initiales
    boites = boitesSauvegardees
        ? JSON.parse(boitesSauvegardees)
        : boitesInitiales;

    soirees = soireesSauvegardees
        ? JSON.parse(soireesSauvegardees)
        : soireesInitiales;
}

function sauvegarderDonnees() {
    localStorage.setItem(CLE_BOITES, JSON.stringify(boites));
    localStorage.setItem(CLE_SOIREES, JSON.stringify(soirees));
}


/* ─────────────────────────────────────
   2. RENDU DES CARTES

   On génère le HTML depuis les données JS,
   plutôt que de l'écrire en dur dans le HTML.
   C'est le principe fondamental du développement
   web dynamique : les données pilotent l'affichage.

   Chaque fonction de rendu vide le conteneur
   et le remplit depuis zéro. Simple et fiable.
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
                style="background-image: url('${boite.img || ""}');">
            </div>
            <div class="pro-card-body">
                <h3 class="pro-card-name">${boite.name}</h3>
                <p class="pro-card-sub">📍 ${boite.ville} · 🎵 ${boite.music}</p>
                <p class="pro-card-desc">${boite.description}</p>
            </div>
            <div class="pro-card-actions">
                <button class="btn-edit" data-id="${boite.id}">Modifier</button>
                <button class="btn-delete" data-id="${boite.id}">Supprimer</button>
            </div>
        </article>`;
}

function templateCarteSoiree(soiree) {
    // On retrouve la boîte associée pour afficher son nom
    const boite = boites.find((b) => b.id === soiree.idBoite);
    const nomBoite = boite ? boite.name : "Boîte introuvable";

    const dateFormatee = new Date(soiree.date + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return `
        <article class="pro-card">
            <div class="pro-card-img"
                style="background-image: url('${soiree.poster || ""}');">
            </div>
            <div class="pro-card-body">
                <h3 class="pro-card-name">${soiree.name}</h3>
                <p class="pro-card-sub">📅 ${dateFormatee} — ${soiree.heure}</p>
                <p class="pro-card-sub">💰 ${soiree.prix} · 🏠 ${nomBoite}</p>
                <p class="pro-card-desc">${soiree.description}</p>
            </div>
            <div class="pro-card-actions">
                <button class="btn-edit" data-id="${soiree.id}">Modifier</button>
                <button class="btn-delete" data-id="${soiree.id}">Supprimer</button>
            </div>
        </article>`;
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

// Champs HTML du formulaire Boîte (pré-remplis si modification)
function champsBoite(boite = {}) {
    return `
        <label>Nom de la boîte *
            <input type="text" name="name"
                value="${boite.name || ""}" required>
        </label>
        <label>Ville *
            <input type="text" name="ville"
                value="${boite.ville || ""}" required>
        </label>
        <label>Style musical *
            <input type="text" name="music"
                placeholder="Ex : Techno, Open Format…"
                value="${boite.music || ""}" required>
        </label>
        <label>Description
            <textarea name="description" rows="3">${boite.description || ""}</textarea>
        </label>
        <label>URL de l'image
            <input type="text" name="img"
                placeholder="/FRONT_END/img/…"
                value="${boite.img || ""}">
        </label>
        <div class="modal-btns">
            <button type="button" id="btnAnnuler" class="modal-btn-cancel">Annuler</button>
            <button type="submit" class="modal-btn-submit">Enregistrer</button>
        </div>`;
}

// Champs HTML du formulaire Soirée (pré-remplis si modification)
function champsSoiree(soiree = {}) {
    // On génère les <option> depuis les boîtes existantes
    const optionsBoites = boites
        .map((b) => `
            <option value="${b.id}" ${soiree.idBoite === b.id ? "selected" : ""}>
                ${b.name}
            </option>`)
        .join("");

    return `
        <label>Nom de la soirée *
            <input type="text" name="name"
                value="${soiree.name || ""}" required>
        </label>
        <label>Date *
            <input type="date" name="date"
                value="${soiree.date || ""}" required>
        </label>
        <label>Heure *
            <input type="text" name="heure"
                placeholder="Ex : 23h00"
                value="${soiree.heure || ""}" required>
        </label>
        <label>Prix
            <input type="text" name="prix"
                placeholder="Ex : 15€"
                value="${soiree.prix || ""}">
        </label>
        <label>Boîte associée *
            <select name="idBoite" required>
                <option value="" disabled ${!soiree.idBoite ? "selected" : ""}>
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

   Chaque action :
   1. Modifie le tableau de données (boites ou soirees)
   2. Sauvegarde dans le localStorage
   3. Re-génère l'affichage concerné
───────────────────────────────────── */

// ── BOÎTES ──

function ajouterBoite() {
    ouvrirModale("Ajouter une boîte", champsBoite(), (donnees) => {
        const nouvelleBoite = {
            id: genererIdBoite(),
            name: donnees.get("name").trim(),
            ville: donnees.get("ville").trim(),
            music: donnees.get("music").trim(),
            description: donnees.get("description").trim(),
            img: donnees.get("img").trim(),
        };

        boites.push(nouvelleBoite);
        sauvegarderDonnees();
        renderBoites();
        fermerModale();
    });
}

function modifierBoite(id) {
    const boite = boites.find((b) => b.id === id);
    if (!boite) return;

    ouvrirModale("Modifier la boîte", champsBoite(boite), (donnees) => {
        // On modifie directement l'objet trouvé dans le tableau
        boite.name = donnees.get("name").trim();
        boite.ville = donnees.get("ville").trim();
        boite.music = donnees.get("music").trim();
        boite.description = donnees.get("description").trim();
        boite.img = donnees.get("img").trim();

        sauvegarderDonnees();
        renderBoites();
        // Les cartes soirées affichent le nom de la boîte,
        // donc on les recharge aussi si le nom a changé
        renderSoirees();
        fermerModale();
    });
}

function supprimerBoite(id) {
    const boite = boites.find((b) => b.id === id);
    if (!boite) return;

    const confirme = confirm(
        `Supprimer "${boite.name}" ?\n\nAttention : les soirées liées à cette boîte seront également supprimées.`
    );
    if (!confirme) return;

    boites = boites.filter((b) => b.id !== id);
    // On supprime aussi les soirées orphelines (sans boîte)
    soirees = soirees.filter((s) => s.idBoite !== id);

    sauvegarderDonnees();
    renderBoites();
    renderSoirees();
}

function genererIdBoite() {
    if (boites.length === 0) return 1;
    return Math.max(...boites.map((b) => b.id)) + 1;
}

// ── SOIRÉES ──

function ajouterSoiree() {
    if (boites.length === 0) {
        alert("Ajoutez d'abord au moins une boîte avant de créer une soirée.");
        return;
    }

    ouvrirModale("Ajouter une soirée", champsSoiree(), (donnees) => {
        const nouvelleSoiree = {
            id: genererIdSoiree(),
            name: donnees.get("name").trim(),
            date: donnees.get("date"),
            heure: donnees.get("heure").trim(),
            prix: donnees.get("prix").trim(),
            idBoite: parseInt(donnees.get("idBoite")),
            description: donnees.get("description").trim(),
            poster: donnees.get("poster").trim(),
        };

        soirees.push(nouvelleSoiree);
        sauvegarderDonnees();
        renderSoirees();
        fermerModale();
    });
}

function modifierSoiree(id) {
    const soiree = soirees.find((s) => s.id === id);
    if (!soiree) return;

    ouvrirModale("Modifier la soirée", champsSoiree(soiree), (donnees) => {
        soiree.name = donnees.get("name").trim();
        soiree.date = donnees.get("date");
        soiree.heure = donnees.get("heure").trim();
        soiree.prix = donnees.get("prix").trim();
        soiree.idBoite = parseInt(donnees.get("idBoite"));
        soiree.description = donnees.get("description").trim();
        soiree.poster = donnees.get("poster").trim();

        sauvegarderDonnees();
        renderSoirees();
        fermerModale();
    });
}

function supprimerSoiree(id) {
    const soiree = soirees.find((s) => s.id === id);
    if (!soiree) return;

    const confirme = confirm(`Supprimer "${soiree.name}" ? Cette action est irréversible.`);
    if (!confirme) return;

    soirees = soirees.filter((s) => s.id !== id);
    sauvegarderDonnees();
    renderSoirees();
}

function genererIdSoiree() {
    if (soirees.length === 0) return 1;
    return Math.max(...soirees.map((s) => s.id)) + 1;
}


/* ─────────────────────────────────────
   5. ÉCOUTEURS D'ÉVÉNEMENTS

   On utilise la "délégation d'événements" sur
   les conteneurs #boitesList et #soireesList.
   Plutôt que d'attacher un écouteur sur chaque
   bouton (qui sont créés et détruits dynamiquement),
   on écoute le clic sur le parent et on identifie
   le bouton ciblé avec event.target.closest().

   closest() remonte dans les parents du DOM
   jusqu'à trouver un élément qui correspond
   au sélecteur donné, ou retourne null.
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

        if (btnEdit) modifierBoite(parseInt(btnEdit.dataset.id));
        if (btnDelete) supprimerBoite(parseInt(btnDelete.dataset.id));
    });

    // Délégation sur la liste des soirées
    document.querySelector("#soireesList").addEventListener("click", (e) => {
        const btnEdit = e.target.closest(".btn-edit");
        const btnDelete = e.target.closest(".btn-delete");

        if (btnEdit) modifierSoiree(parseInt(btnEdit.dataset.id));
        if (btnDelete) supprimerSoiree(parseInt(btnDelete.dataset.id));
    });

    // Fermeture de la modale via le bouton ✕
    document.querySelector("#modalClose")
        .addEventListener("click", fermerModale);

    // Fermeture en cliquant sur le fond sombre
    // (mais pas si on clique à l'intérieur de la modale)
    document.querySelector("#modalOverlay").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) fermerModale();
    });

    // Fermeture via le bouton Annuler
    // (délégation car ce bouton est injecté dynamiquement dans la modale)
    document.querySelector("#modalOverlay").addEventListener("click", (e) => {
        if (e.target.id === "btnAnnuler") fermerModale();
    });

    // Déconnexion (placeholder — la vraie logique JWT viendra avec le backend)
    document.querySelector("#logoutBtn").addEventListener("click", () => {
        if (confirm("Voulez-vous vous déconnecter ?")) {
            window.location.href = "/FRONT_END/HTML/Connexion_pro.html";
        }
    });
}


/* ─────────────────────────────────────
   6. INITIALISATION
───────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
    chargerDonnees();
    renderBoites();
    renderSoirees();
    initEvenements();
});
