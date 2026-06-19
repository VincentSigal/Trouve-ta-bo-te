// ============================================================
//  ADMIN.JS — Gestion des boîtes de nuit (CRUD)
//  Stockage : localStorage (temporaire, en attendant le backend)
//
//  TODO backend : remplacer les fonctions loadBoites() et saveBoites()
//  par des appels fetch() vers ton API REST.
// ============================================================

import { boites as boitesInitiales } from "../data/data_cards.js";

// ── MOT DE PASSE (temporaire, côté front) ──
// TODO backend : remplacer par une vraie route d'authentification
const ADMIN_PASSWORD = "admin123"; // ← Change ce mot de passe

// ── CLÉS LOCALSTORAGE ──
const LS_KEY = "ttb_boites";
const LS_AUTH = "ttb_admin_auth";

// ── ÉTAT ──
let editingIndex = null; // null = ajout, number = modification


// ============================================================
//  AUTHENTIFICATION
// ============================================================

const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const passwordInput = document.getElementById("passwordInput");
const errorLogin = document.getElementById("errorLogin");

// HEADER DISPARAÎT AU SCROLL
function scrollHeader() {
    const header = document.querySelector("#header");

    let lastScroll = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }

        lastScroll = currentScroll;
    });
};
scrollHeader();

/* BURGER */
function init_burger() {
    const header = document.querySelector("header");

    const burger_html = `
<nav class="burger">
                <div class="hamburger">
                    <div class="ligne"></div>
                    <div class="ligne"></div>
                    <div class="ligne"></div>
                </div>
                <ul class="menu_burger">
                    <li><a href="/FRONT_END/HTML/Accueil.html" title="Accueil">Accueil</a></li>
                    <li><a href="/FRONT_END/HTML/Boîtes_de_nuit.html" title="Boîtes de nuit">Boîtes de nuit</a></li>
                    <li><a href="#" title="Soirées">Soirées</a></li>
                    <li><a href="/FRONT_END/HTML/Contact.html" title="Contact">Contact</a></li>
                        <p class="burger_sinscrire">Ne rate aucune soirée avec notre Newsletter
                            !</p>
                    </li>
                </ul>
                <div class="foreground_menu"></div>
            </nav>
`;

    header.insertAdjacentHTML("beforeend", burger_html);

    const hamburger = document.querySelector(".hamburger");
    const menu_burger = document.querySelector(".menu_burger");
    const foreground_menu = document.querySelector(".foreground_menu");


    hamburger.addEventListener("click", () => {
        menu_burger.classList.toggle("open");
        hamburger.classList.toggle("active");
        if (menu_burger.classList.contains("open")) {
            foreground_menu.classList.add("open");
        } else {
            foreground_menu.classList.remove("open");
        };
    });
};
init_burger();

function checkAuth() {
    if (sessionStorage.getItem(LS_AUTH) === "true") {
        showAdmin();
    }
}

function showAdmin() {
    loginScreen.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    renderList();
}

loginBtn.addEventListener("click", () => {
    if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem(LS_AUTH, "true");
        errorLogin.classList.remove("visible");
        showAdmin();
    } else {
        errorLogin.classList.add("visible");
        passwordInput.value = "";
        passwordInput.focus();
    }
});

// Permettre validation avec Entrée
passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginBtn.click();
});

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(LS_AUTH);
    adminPanel.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    passwordInput.value = "";
});


// ============================================================
//  STOCKAGE (localStorage)
//  TODO backend : remplacer ces 2 fonctions par des fetch()
// ============================================================

/**
 * Charge les boîtes depuis localStorage.
 * Si aucune donnée, initialise avec data_cards.js.
 *
 * TODO backend :
 *   async function loadBoites() {
 *     const res = await fetch("/api/boites");
 *     return await res.json();
 *   }
 */
function loadBoites() {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // 1ère visite : on copie les données initiales dans le localStorage
    localStorage.setItem(LS_KEY, JSON.stringify(boitesInitiales));
    return [...boitesInitiales];
}

/**
 * Sauvegarde les boîtes dans localStorage.
 *
 * TODO backend :
 *   async function saveBoites(boites) {
 *     await fetch("/api/boites", {
 *       method: "PUT",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify(boites)
 *     });
 *   }
 */
function saveBoites(boites) {
    localStorage.setItem(LS_KEY, JSON.stringify(boites));
}


// ============================================================
//  FORMULAIRE
// ============================================================

const formContainer = document.getElementById("formContainer");
const formTitle = document.getElementById("formTitle");
const btnOpenForm = document.getElementById("btnOpenForm");
const btnSave = document.getElementById("btnSave");
const btnCancel = document.getElementById("btnCancel");
const errorForm = document.getElementById("errorForm");

// Champs du formulaire
const inputName = document.getElementById("inputName");
const inputLocation = document.getElementById("inputLocation");
const inputLocationLink = document.getElementById("inputLocationLink");
const inputMusique = document.getElementById("inputMusique");
const inputTag1 = document.getElementById("inputTag1");
const inputTag2 = document.getElementById("inputTag2");
const inputDescription = document.getElementById("inputDescription");
const inputBackground = document.getElementById("inputBackground");

btnOpenForm.addEventListener("click", () => {
    openForm(null);
});

btnCancel.addEventListener("click", () => {
    closeForm();
});

function openForm(index) {
    editingIndex = index;
    errorForm.classList.add("hidden");
    formContainer.classList.remove("hidden");

    if (index !== null) {
        // Mode modification (UPDATE)
        formTitle.textContent = "Modifier la boîte";
        const boites = loadBoites();
        const b = boites[index];
        inputName.value = b.name;
        inputLocation.value = b.location.location_name;
        inputLocationLink.value = b.location.location_link;
        inputMusique.value = b.musique;
        inputTag1.value = b.tags[0];
        inputTag2.value = b.tags[1];
        inputDescription.value = b.description;
        inputBackground.value = b.background;
    } else {
        // Mode ajout (CREATE)
        formTitle.textContent = "Ajouter une boîte";
        clearForm();
    }

    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeForm() {
    formContainer.classList.add("hidden");
    clearForm();
    editingIndex = null;
}

function clearForm() {
    inputName.value = "";
    inputLocation.value = "";
    inputLocationLink.value = "";
    inputMusique.value = "";
    inputTag1.value = "";
    inputTag2.value = "";
    inputDescription.value = "";
    inputBackground.value = "";
}

// ── ENREGISTRER (CREATE ou UPDATE) ──
btnSave.addEventListener("click", () => {

    // Validation champs obligatoires
    if (
        !inputName.value.trim() ||
        !inputLocation.value.trim() ||
        !inputMusique.value.trim() ||
        !inputTag1.value.trim() ||
        !inputTag2.value.trim() ||
        !inputDescription.value.trim()
    ) {
        errorForm.classList.remove("hidden");
        return;
    }

    errorForm.classList.add("hidden");

    const nouvelleBoite = {
        background: inputBackground.value.trim() || "/FRONT_END/img/background_club.jpg",
        name: inputName.value.trim().toUpperCase(),
        location: {
            location_link: inputLocationLink.value.trim() || "#",
            location_name: inputLocation.value.trim(),
        },
        tags: [inputTag1.value.trim(), inputTag2.value.trim()],
        description: inputDescription.value.trim(),
        linkDetails: "/FRONT_END/HTML/Details_boite.html",
        music: inputMusique.value.trim(),
    };

    const boites = loadBoites();

    if (editingIndex !== null) {
        // UPDATE
        boites[editingIndex] = nouvelleBoite;
    } else {
        // CREATE
        boites.push(nouvelleBoite);
    }

    saveBoites(boites);
    closeForm();
    renderList();
});


// ============================================================
//  AFFICHAGE DE LA LISTE (READ)
// ============================================================

function renderList() {
    const boitesList = document.getElementById("boitesList");
    const boites = loadBoites();

    if (boites.length === 0) {
        boitesList.innerHTML = `<p style="color: var(--accent); font-size: 0.9rem;">Aucune boîte enregistrée.</p>`;
        return;
    }

    boitesList.innerHTML = boites.map((b, index) => `
        <div class="boite-card">
            <div class="boite-card-img" style="background-image: url(${b.background})"></div>
            <div class="boite-card-body">
                <p class="boite-card-name">${b.name}</p>
                <p class="boite-card-location">📍 ${b.location.location_name}</p>
                <div class="boite-card-tags">
                    <span>#${b.tags[0]}</span>
                    <span>#${b.tags[1]}</span>
                    <span>${b.music}</span>
                </div>
                <p class="boite-card-desc">${b.description}</p>
            </div>
            <div class="boite-card-actions">
                <button class="btn-edit" data-index="${index}">✏️ Modifier</button>
                <button class="btn-delete" data-index="${index}">🗑 Supprimer</button>
            </div>
        </div>
    `).join("");

    // Events modifier
    document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", () => {
            openForm(parseInt(btn.dataset.index));
        });
    });

    // Events supprimer
    document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
            deleteBoite(parseInt(btn.dataset.index));
        });
    });
}


// ============================================================
//  SUPPRESSION (DELETE)
// ============================================================

function deleteBoite(index) {
    const boites = loadBoites();
    const nom = boites[index].name;

    if (!confirm(`Supprimer "${nom}" ? Cette action est irréversible.`)) return;

    boites.splice(index, 1);
    saveBoites(boites);
    renderList();
}


// ============================================================
//  EXPORT data_cards.js
// ============================================================

document.getElementById("btnExport").addEventListener("click", () => {
    const boites = loadBoites();

    const contenu = `/* ARRAY CARDS BOITES DE NUIT */\n\nexport let boites = ${JSON.stringify(boites, null, 2)};\n`;

    const blob = new Blob([contenu], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_cards.js";
    a.click();
    URL.revokeObjectURL(url);
});


// ── INIT ──
checkAuth();
