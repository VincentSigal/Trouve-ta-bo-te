import db from "../config/db.js";

/* ==========================
   LIRE TOUTES LES SOIRÉES
   GET /api/events
   Triées par date la plus proche en premier.
   ========================== */

export async function getAllEvents(req, res) {

    try {

        const sql = `SELECT events.*, boites.name AS boite_name, cities.city_name, music.music AS music_name
                     FROM events
                     JOIN boites ON events.idClub = boites.idClub
                     JOIN cities ON boites.idCity = cities.idCity
                     LEFT JOIN music ON music.idMusic = events.idMusic
                     ORDER BY events.date_ ASC`;

        const [results] = await db.query(sql);
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   LIRE UNE SEULE SOIRÉE
   GET /api/events/:id
   ========================== */

export async function getEventById(req, res) {

    const id = req.params.id;

    try {

        const sql = `SELECT events.*, boites.name AS boite_name, cities.city_name, music.music AS music_name
                     FROM events
                     JOIN boites ON events.idClub = boites.idClub
                     JOIN cities ON boites.idCity = cities.idCity
                     LEFT JOIN music ON music.idMusic = events.idMusic
                     WHERE events.idEvent = ?`;

        const [results] = await db.query(sql, [id]);

        if (results.length === 0) {
            res.status(404).json({ error: "Soirée introuvable" });
            return;
        }

        res.json(results[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   CRÉER UNE SOIRÉE
   POST /api/events
   Le style musical est facultatif : s'il n'est pas fourni,
   on reprend automatiquement celui de la boîte organisatrice
   (une soirée n'a pas forcément un style propre, comme décidé
   lors de la migration des données).
   ========================== */

export async function createEvent(req, res) {

    const { name, date_, price, description, poster, idClub, music } = req.body;
    let idMusic = req.body.idMusic;

    try {

        const autorise = await verifierProprietaireClub(idClub, req.user);

        if (autorise === "INTROUVABLE") {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à créer une soirée pour cette boîte" });
            return;
        }

        if (idMusic === undefined && music !== undefined) {
            idMusic = await trouverOuCreerMusique(music);
        }

        if (idMusic === undefined) {
            idMusic = await recupererStyleDeLaBoite(idClub);
        }

        const sql = `INSERT INTO events (name, date_, price, description, poster, idMusic, idClub)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [name, date_, price, description, poster, idMusic, idClub]);

        res.status(201).json({ message: "Soirée créée", idEvent: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


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
   VÉRIFIE QUE LA PERSONNE CONNECTÉE (req.user)
   EST BIEN LE PROPRIÉTAIRE DE LA BOÎTE idClub, OU UN ADMIN.
   Renvoie true / false, ou "INTROUVABLE" si la boîte n'existe pas.
   ========================== */

async function verifierProprietaireClub(idClub, user) {

    const [resultat] = await db.query("SELECT idUser FROM boites WHERE idClub = ?", [idClub]);

    if (resultat.length === 0) {
        return "INTROUVABLE";
    }

    const estProprietaire = resultat[0].idUser === user.idUser;
    const estAdmin = user.role === "admin";

    return estProprietaire || estAdmin;
}


/* ==========================
   RÉCUPÈRE LE STYLE MUSICAL DÉJÀ ASSOCIÉ À UNE BOÎTE
   ========================== */

async function recupererStyleDeLaBoite(idClub) {

    const [resultat] = await db.query("SELECT idMusic FROM style WHERE idClub = ?", [idClub]);

    if (resultat.length === 0) {
        return null;
    }

    return resultat[0].idMusic;
}


/* ==========================
   REMPLACER UNE SOIRÉE ENTIÈREMENT
   PUT /api/events/:id
   ========================== */

export async function replaceEvent(req, res) {

    const id = req.params.id;
    const { name, date_, price, description, poster, idClub, music } = req.body;
    let idMusic = req.body.idMusic;

    try {

        const autorise = await verifierProprietaireClub(idClub, req.user);

        if (autorise === "INTROUVABLE") {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à modifier cette soirée" });
            return;
        }

        if (idMusic === undefined && music !== undefined) {
            idMusic = await trouverOuCreerMusique(music);
        }

        if (idMusic === undefined) {
            idMusic = await recupererStyleDeLaBoite(idClub);
        }

        const sql = `UPDATE events
                     SET name = ?, date_ = ?, price = ?, description = ?, poster = ?, idMusic = ?, idClub = ?
                     WHERE idEvent = ?`;

        const [result] = await db.query(sql, [name, date_, price, description, poster, idMusic, idClub, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Soirée introuvable" });
            return;
        }

        res.json({ message: "Soirée remplacée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   MODIFIER UNE SOIRÉE (partiellement)
   PATCH /api/events/:id
   ========================== */

export async function updateEvent(req, res) {

    const id = req.params.id;

    const champsAutorises = ["name", "date_", "price", "description", "poster", "idMusic", "idClub"];

    const champsAModifier = [];
    const valeurs = [];

    champsAutorises.forEach((champ) => {
        if (req.body[champ] !== undefined) {
            champsAModifier.push(`${champ} = ?`);
            valeurs.push(req.body[champ]);
        }
    });

    // Le style a été envoyé sous forme de nom plutôt que d'id
    const concerneMusique = req.body.idMusic === undefined && req.body.music !== undefined;

    if (champsAModifier.length === 0 && concerneMusique === false) {
        res.status(400).json({ error: "Aucun champ valide à modifier" });
        return;
    }

    try {

        // On vérifie la propriété par rapport à la boîte actuelle
        // de la soirée (ou la nouvelle, si idClub fait partie du PATCH)
        const [ligneActuelle] = await db.query("SELECT idClub FROM events WHERE idEvent = ?", [id]);

        if (ligneActuelle.length === 0) {
            res.status(404).json({ error: "Soirée introuvable" });
            return;
        }

        const idClubConcerne = req.body.idClub !== undefined ? req.body.idClub : ligneActuelle[0].idClub;

        const autorise = await verifierProprietaireClub(idClubConcerne, req.user);

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à modifier cette soirée" });
            return;
        }

        if (concerneMusique === true) {
            const idMusic = await trouverOuCreerMusique(req.body.music);
            champsAModifier.push("idMusic = ?");
            valeurs.push(idMusic);
        }

        const sql = `UPDATE events SET ${champsAModifier.join(", ")} WHERE idEvent = ?`;
        valeurs.push(id);

        await db.query(sql, valeurs);

        res.json({ message: "Soirée modifiée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   SUPPRIMER UNE SOIRÉE
   DELETE /api/events/:id
   ========================== */

export async function deleteEvent(req, res) {

    const id = req.params.id;

    try {

        const [ligneActuelle] = await db.query("SELECT idClub FROM events WHERE idEvent = ?", [id]);

        if (ligneActuelle.length === 0) {
            res.status(404).json({ error: "Soirée introuvable" });
            return;
        }

        const autorise = await verifierProprietaireClub(ligneActuelle[0].idClub, req.user);

        if (autorise === false) {
            res.status(403).json({ error: "Tu n'es pas autorisé à supprimer cette soirée" });
            return;
        }

        await db.query("DELETE FROM events WHERE idEvent = ?", [id]);

        res.json({ message: "Soirée supprimée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
