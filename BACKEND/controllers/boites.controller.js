import db from "../config/db.js";

/* ==========================
   LIRE TOUTES LES BOÎTES
   GET /api/boites
   ========================== */

export async function getAllBoites(req, res) {

    try {

        const sql = `SELECT boites.*, cities.city_name, music.music AS music_name
                     FROM boites
                     JOIN cities ON boites.idCity = cities.idCity
                     LEFT JOIN style ON style.idClub = boites.idClub
                     LEFT JOIN music ON music.idMusic = style.idMusic
                     ORDER BY boites.clicks DESC`;

        const [results] = await db.query(sql);
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   LIRE UNE SEULE BOÎTE
   GET /api/boites/:id
   ========================== */

export async function getBoiteById(req, res) {

    const id = req.params.id;

    try {
        const sql = `SELECT boites.*, cities.city_name, music.music AS music_name
                     FROM boites
                     JOIN cities ON boites.idCity = cities.idCity
                     LEFT JOIN style ON style.idClub = boites.idClub
                     LEFT JOIN music ON music.idMusic = style.idMusic
                     WHERE boites.idClub = ?`;

        const [results] = await db.query(sql, [id]);

        if (results.length === 0) {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        const boite = results[0];

        const [photos] = await db.query(
            "SELECT urlPhoto, photo_name FROM photos_library WHERE idClub = ?", [id]
        );
        boite.photos = photos;

        const [horaires] = await db.query(
            "SELECT day, opening_hours, closing_hours FROM opening_schedule WHERE idClub = ?", [id]
        );
        boite.horaires = horaires;

        res.json(boite);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   CRÉER UNE BOÎTE
   POST /api/boites
   ========================== */

export async function createBoite(req, res) {

    const { background,
        logo,
        name,
        location_link,
        adress_name,
        maps_iframe,
        description,
        paragraph,
        tags1,
        tags2,
        age_min,
        age_max,
        price,
        instagram,
        siret,
        idCity,
        city,
        music
    } = req.body;

    // Seuls les owners et les admins peuvent créer une boîte
    if (req.user.role !== "owner" && req.user.role !== "admin") {
        res.status(403).json({ error: "Seuls les owners ou admins peuvent créer une boîte" });
        return;
    }

    // Un owner ne peut créer une boîte que pour lui-même :
    // on ignore volontairement tout idUser envoyé dans le corps
    // de la requête pour éviter qu'il s'attribue la boîte à
    // un autre utilisateur. Un admin, lui, peut préciser le
    // propriétaire de son choix.
    let idUser = req.user.idUser;

    if (req.user.role === "admin" && req.body.idUser !== undefined) {
        idUser = req.body.idUser;
    }

    try {

        // idCity peut être fourni directement (id numérique),
        // ou un nom de ville à chercher/créer (formulaire espace pro)
        let idCityFinal = idCity;

        if (idCityFinal === undefined && city !== undefined) {
            idCityFinal = await trouverOuCreerVille(city);
        }

        const sql = `INSERT INTO boites
            (background, logo, name, location_link, adress_name, maps_iframe, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [background, logo, name, location_link, adress_name, maps_iframe, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCityFinal]);

        const idClub = result.insertId;

        // Le style musical est géré à part (table music + style),
        // puisqu'il n'existe pas de colonne "music" sur boites
        if (music !== undefined) {
            const idMusic = await trouverOuCreerMusique(music);
            await definirStyleBoite(idClub, idMusic);
        }

        res.status(201).json({ message: "Boîte créée", idClub });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   TROUVE UNE VILLE PAR SON NOM, OU LA CRÉE
   SI ELLE N'EXISTE PAS ENCORE, ET RENVOIE SON idCity
   ========================== */

async function trouverOuCreerVille(nomVille) {

    const [existant] = await db.query("SELECT idCity FROM cities WHERE city_name = ?", [nomVille]);

    if (existant.length > 0) {
        return existant[0].idCity;
    }

    const [resultat] = await db.query("INSERT INTO cities (city_name) VALUES (?)", [nomVille]);
    return resultat.insertId;
}


/* ==========================
   TROUVE UN STYLE MUSICAL PAR SON NOM, OU LE CRÉE
   SI IL N'EXISTE PAS ENCORE, ET RENVOIE SON idMusic
   ========================== */

async function trouverOuCreerMusique(nomStyle) {

    const [existant] = await db.query("SELECT idMusic FROM music WHERE music = ?", [nomStyle]);

    if (existant.length > 0) {
        return existant[0].idMusic;
    }

    const [resultat] = await db.query("INSERT INTO music (music) VALUES (?)", [nomStyle]);
    return resultat.insertId;
}


/* ==========================
   REMPLACE LE STYLE D'UNE BOÎTE
   (une boîte n'a qu'un seul style, comme décidé
   précédemment — "Rap, Shatta, Afro" = un seul style)
   ========================== */

async function definirStyleBoite(idClub, idMusic) {

    await db.query("DELETE FROM style WHERE idClub = ?", [idClub]);
    await db.query("INSERT INTO style (idMusic, idClub) VALUES (?, ?)", [idMusic, idClub]);
}


/* ==========================
   REMPLACER UNE BOÎTE ENTIÈREMENT
   PUT /api/boites/:id
   (tous les champs sont obligatoires)
   ========================== */

export async function replaceBoite(req, res) {

    const id = req.params.id;
    const { background, logo, name, location_link, adress_name, maps_iframe, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCity, city, music } = req.body;

    try {

        const autorise = await verifierProprietaire(id, req.user);

        if (autorise === "INTROUVABLE") {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à modifier cette boîte" });
            return;
        }

        let idCityFinal = idCity;

        if (idCityFinal === undefined && city !== undefined) {
            idCityFinal = await trouverOuCreerVille(city);
        }

        const sql = `UPDATE boites 
                     SET background = ?, logo = ?, name = ?, location_link = ?, adress_name = ?, maps_iframe = ?, description = ?, paragraph = ?, tags1 = ?, tags2 = ?, age_min = ?, age_max = ?, price = ?, instagram = ?, siret = ?, idUser = ?, idCity = ?
                     WHERE idClub = ?`;

        await db.query(sql, [background, logo, name, location_link, adress_name, maps_iframe, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCityFinal, id]);

        if (music !== undefined) {
            const idMusic = await trouverOuCreerMusique(music);
            await definirStyleBoite(id, idMusic);
        }

        res.json({ message: "Boîte remplacée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   VÉRIFIE QUE LA PERSONNE CONNECTÉE (req.user)
   EST BIEN LE PROPRIÉTAIRE DE LA BOÎTE, OU UN ADMIN.
   Renvoie true / false, ou "INTROUVABLE" si la boîte n'existe pas.
   ========================== */

async function verifierProprietaire(idClub, user) {

    const [resultat] = await db.query("SELECT idUser FROM boites WHERE idClub = ?", [idClub]);

    if (resultat.length === 0) {
        return "INTROUVABLE";
    }

    const estProprietaire = resultat[0].idUser === user.idUser;
    const estAdmin = user.role === "admin";

    return estProprietaire || estAdmin;
}


/* ==========================
   MODIFIER UNE BOÎTE (partiellement)
   PATCH /api/boites/:id
   ========================== */

export async function updateBoite(req, res) {

    const id = req.params.id;

    const champsAutorises = ["background", "logo", "name", "location_link", "adress_name", "maps_iframe", "description", "paragraph", "tags1", "tags2", "age_min", "age_max", "price", "instagram", "siret", "idUser", "idCity"];

    const champsAModifier = [];
    const valeurs = [];

    champsAutorises.forEach((champ) => {
        if (req.body[champ] !== undefined) {
            champsAModifier.push(`${champ} = ?`);
            valeurs.push(req.body[champ]);
        }
    });

    const concerneVille = req.body.idCity === undefined && req.body.city !== undefined;
    const concerneMusique = req.body.music !== undefined;

    if (champsAModifier.length === 0 && concerneVille === false && concerneMusique === false) {
        res.status(400).json({ error: "Aucun champ valide à modifier" });
        return;
    }

    try {

        const autorise = await verifierProprietaire(id, req.user);

        if (autorise === "INTROUVABLE") {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à modifier cette boîte" });
            return;
        }

        // La ville a été envoyée sous forme de nom plutôt que d'id
        if (concerneVille === true) {
            const idCityFinal = await trouverOuCreerVille(req.body.city);
            champsAModifier.push("idCity = ?");
            valeurs.push(idCityFinal);
        }

        if (champsAModifier.length > 0) {
            const sql = `UPDATE boites SET ${champsAModifier.join(", ")} WHERE idClub = ?`;
            valeurs.push(id);

            await db.query(sql, valeurs);
        }

        if (concerneMusique === true) {
            const idMusic = await trouverOuCreerMusique(req.body.music);
            await definirStyleBoite(id, idMusic);
        }

        res.json({ message: "Boîte modifiée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   SUPPRIMER UNE BOÎTE
   DELETE /api/boites/:id
   ========================== */

export async function deleteBoite(req, res) {

    const id = req.params.id;

    try {

        const autorise = await verifierProprietaire(id, req.user);

        if (autorise === "INTROUVABLE") {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à supprimer cette boîte" });
            return;
        }

        // On supprime d'abord tout ce qui dépend de cette boîte,
        // sinon les clés étrangères bloquent la suppression
        await db.query("DELETE FROM style WHERE idClub = ?", [id]);
        await db.query("DELETE FROM photos_library WHERE idClub = ?", [id]);
        await db.query("DELETE FROM opening_schedule WHERE idClub = ?", [id]);
        await db.query("DELETE FROM events WHERE idClub = ?", [id]);
        await db.query("DELETE FROM favorites WHERE idClub = ?", [id]);
        await db.query("DELETE FROM subscribes WHERE idClub = ?", [id]);

        await db.query("DELETE FROM boites WHERE idClub = ?", [id]);

        res.json({ message: "Boîte supprimée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   INCRÉMENTER LE COMPTEUR DE CLICS
   POST /api/boites/:id/click
   Appelé quand un utilisateur clique sur "Voir plus de
   détails" d'une boîte, ou sur une soirée organisée par
   cette boîte, pour mesurer sa popularité.
   ========================== */

export async function incrementerClics(req, res) {

    const id = req.params.id;

    try {
        const [result] = await db.query("UPDATE boites SET clicks = clicks + 1 WHERE idClub = ?", [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        res.json({ message: "Clic comptabilisé" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};