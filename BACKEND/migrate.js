/* ==========================
   SCRIPT DE MIGRATION
   Remplit la base de données MySQL avec les données
   qui sont actuellement dans les fichiers JS du frontend
   (FRONT_END/data/data_cards.js et data_events.js).

   A lancer une seule fois avec : node migrate.js
   ========================== */

import db from "./config/db.js";
import { boites } from "../FRONT_END/data/data_cards.js";
import { events } from "../FRONT_END/data/data_events.js";


/* ==========================
   PETITES FONCTIONS POUR CONVERTIR LES DONNEES
   ========================== */

// "50€" -> 50 / "Gratuit avant 23h" -> 0
function parsePrix(texte) {
    if (texte === undefined || texte === null) {
        return 0;
    }

    const resultat = texte.match(/\d+/);

    if (resultat === null) {
        return 0;
    }

    return parseInt(resultat[0]);
}

// Les siret du fichier data_cards.js sont des valeurs de test en doublon
// (ex: 11111111111112 utilisé par 2 boîtes différentes), alors que la colonne
// siret doit être unique. On en génère un unique à partir de l'idClub à la place.
function genererSiret(idClub) {
    return "1111111111" + String(idClub).padStart(4, "0");
}
function parseHeure(texte) {
    const resultat = texte.match(/(\d{1,2})h(\d{2})?/);

    const heures = resultat[1].padStart(2, "0");
    const minutes = resultat[2] !== undefined ? resultat[2] : "00";

    return `${heures}:${minutes}:00`;
}


/* ==========================
   ETAPE 0 : NETTOYER LES TABLES
   (utile si le script est relancé pendant les tests)
   On respecte l'ordre inverse des clés étrangères.
   ========================== */

async function viderLesTables() {
    await db.query("DELETE FROM style");
    await db.query("DELETE FROM opening_schedule");
    await db.query("DELETE FROM photos_library");
    await db.query("DELETE FROM events");
    await db.query("DELETE FROM boites");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM music");
    await db.query("DELETE FROM cities");
}


/* ==========================
   ETAPE 1 : VILLES
   On récupère toutes les villes utilisées par les boîtes
   (+ celle de l'utilisateur test), sans doublons.
   ========================== */

async function creerLesVilles() {
    const nomsDeVilles = new Set();

    boites.forEach((boite) => {
        nomsDeVilles.add(boite.location.location_name);
    });

    nomsDeVilles.add("Montpellier"); // ville de l'utilisateur test

    const idParVille = {};

    for (const nomVille of nomsDeVilles) {
        const sql = "INSERT INTO cities (city_name) VALUES (?)";
        const [resultat] = await db.query(sql, [nomVille]);
        idParVille[nomVille] = resultat.insertId;
    }

    return idParVille;
}


/* ==========================
   ETAPE 2 : STYLES DE MUSIQUE
   Le champ "music" d'une boîte est traité comme UN SEUL style,
   même s'il contient plusieurs mots séparés par des virgules
   (ex: "Rap, Shatta, Afro, Buyon" = un seul style composite).
   ========================== */

async function creerLesStyles() {
    const nomsDeStyles = new Set();

    boites.forEach((boite) => {
        nomsDeStyles.add(boite.music.trim());
    });

    const idParStyle = {};

    for (const nomStyle of nomsDeStyles) {
        const sql = "INSERT INTO music (music) VALUES (?)";
        const [resultat] = await db.query(sql, [nomStyle]);
        idParStyle[nomStyle] = resultat.insertId;
    }

    return idParStyle;
}


/* ==========================
   ETAPE 3 : UTILISATEUR TEST (propriétaire)
   data_users.js ne contient qu'un seul utilisateur de test.
   Il est repris ici directement (le fichier n'exportait pas
   sa variable "users", donc impossible de l'importer).
   Toutes les boîtes lui seront rattachées (idUser = 1).
   ========================== */

async function creerUtilisateurTest(idParVille) {
    const sql = `INSERT INTO users (email, password, date_inscription, newsletter, role, idCity)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    const valeurs = [
        "user.demo@trouvetaboite.fr",
        "motdepasse",
        "2026-06-20",
        false,
        "owner",
        idParVille["Montpellier"],
    ];

    const [resultat] = await db.query(sql, valeurs);
    return resultat.insertId;
}


/* ==========================
   ETAPE 4 : BOITES DE NUIT
   ========================== */

async function creerLesBoites(idParVille, idUser) {
    for (const boite of boites) {
        const sql = `INSERT INTO boites
            (idClub, background, logo, name, location_link, description, paragraph,
             tags1, tags2, age_min, age_max, price, instagram, siret, clicks, idUser, idCity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const valeurs = [
            boite.idClub,
            boite.background,
            boite.logo.logo_img,
            boite.name,
            boite.location.location_link,
            boite.description,
            boite.summary.paragraph,
            boite.tags[0],
            boite.tags[1],
            boite.age.age_min,
            boite.age.age_max,
            parsePrix(boite.price),
            boite.instagram,
            genererSiret(boite.idClub),
            0,
            idUser,
            idParVille[boite.location.location_name],
        ];

        await db.query(sql, valeurs);
    }
}


/* ==========================
   ETAPE 5 : LIEN BOITES <-> STYLES DE MUSIQUE
   ========================== */

async function creerLesStylesDesBoites(idParStyle) {
    for (const boite of boites) {
        const style = boite.music.trim();

        const sql = "INSERT INTO style (idMusic, idClub) VALUES (?, ?)";
        await db.query(sql, [idParStyle[style], boite.idClub]);
    }
}


/* ==========================
   ETAPE 6 : PHOTOS
   ========================== */

async function creerLesPhotos() {
    for (const boite of boites) {
        for (const urlPhoto of boite.img.photos) {
            const sql = "INSERT INTO photos_library (urlPhoto, photo_name, idClub) VALUES (?, ?, ?)";
            await db.query(sql, [urlPhoto, boite.name, boite.idClub]);
        }
    }
}


/* ==========================
   ETAPE 7 : HORAIRES D'OUVERTURE
   Conversion approximative : "Lundi, samedi, dimanche" + "00h - 7h"
   devient une ligne par jour avec heure d'ouverture/fermeture.
   ========================== */

async function creerLesHoraires() {
    for (const boite of boites) {
        const jours = boite.hours.date.split(",").map((jour) => jour.trim());
        const [texteOuverture, texteFermeture] = boite.hours.time.split("-").map((heure) => heure.trim());

        const heureOuverture = parseHeure(texteOuverture);
        const heureFermeture = parseHeure(texteFermeture);

        for (const jour of jours) {
            const sql = `INSERT INTO opening_schedule (day, opening_hours, closing_hours, idClub)
                         VALUES (?, ?, ?, ?)`;
            await db.query(sql, [jour, heureOuverture, heureFermeture, boite.idClub]);
        }
    }
}


/* ==========================
   ETAPE 8 : SOIREES (EVENTS)
   idMusic n'existe pas dans data_events.js : on prend le premier
   style de musique de la boîte associée à la soirée.
   ========================== */

async function creerLesEvents(idParStyle) {
    const boiteParId = {};
    boites.forEach((boite) => (boiteParId[boite.idClub] = boite));

    for (const event of events) {
        const boite = boiteParId[event.idClub];
        const style = boite.music.trim();

        const sql = `INSERT INTO events (idEvent, name, date_, price, description, poster, idMusic, idClub)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const valeurs = [
            event.idEvent,
            event.name,
            `${event.date} ${parseHeure(event.heure)}`,
            parsePrix(event.price),
            event.description,
            event.poster,
            idParStyle[style],
            event.idClub,
        ];

        await db.query(sql, valeurs);
    }
}


/* ==========================
   LANCEMENT DU SCRIPT
   ========================== */

async function migrer() {
    console.log("Suppression des anciennes données...");
    await viderLesTables();

    console.log("Création des villes...");
    const idParVille = await creerLesVilles();

    console.log("Création des styles de musique...");
    const idParStyle = await creerLesStyles();

    console.log("Création de l'utilisateur test...");
    const idUser = await creerUtilisateurTest(idParVille);

    console.log("Création des boîtes de nuit...");
    await creerLesBoites(idParVille, idUser);

    console.log("Liaison boîtes <-> styles de musique...");
    await creerLesStylesDesBoites(idParStyle);

    console.log("Création des photos...");
    await creerLesPhotos();

    console.log("Création des horaires d'ouverture...");
    await creerLesHoraires();

    console.log("Création des soirées...");
    await creerLesEvents(idParStyle);

    console.log("Migration terminée !");
    process.exit(0);
}

migrer();