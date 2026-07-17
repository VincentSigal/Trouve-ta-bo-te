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
   ========================== */

export async function createEvent(req, res) {

    const { name, date_, price, description, poster, idMusic, idClub } = req.body;

    const sql = `INSERT INTO events (name, date_, price, description, poster, idMusic, idClub)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await db.query(sql, [name, date_, price, description, poster, idMusic, idClub]);

        res.status(201).json({ message: "Soirée créée", idEvent: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   REMPLACER UNE SOIRÉE ENTIÈREMENT
   PUT /api/events/:id
   ========================== */

export async function replaceEvent(req, res) {

    const id = req.params.id;
    const { name, date_, price, description, poster, idMusic, idClub } = req.body;

    const sql = `UPDATE events
                 SET name = ?, date_ = ?, price = ?, description = ?, poster = ?, idMusic = ?, idClub = ?
                 WHERE idEvent = ?`;

    try {
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

    if (champsAModifier.length === 0) {
        res.status(400).json({ error: "Aucun champ valide à modifier" });
        return;
    }

    const sql = `UPDATE events SET ${champsAModifier.join(", ")} WHERE idEvent = ?`;
    valeurs.push(id);

    try {
        const [result] = await db.query(sql, valeurs);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Soirée introuvable" });
            return;
        }

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
        const [result] = await db.query("DELETE FROM events WHERE idEvent = ?", [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Soirée introuvable" });
            return;
        }

        res.json({ message: "Soirée supprimée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
