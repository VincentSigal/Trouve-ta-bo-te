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
        const [results] = await db.query("SELECT * FROM boites WHERE idClub = ?", [id]);

        if (results.length === 0) {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        res.json(results[0]);

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
        description,
        paragraph,
        tags1,
        tags2,
        age_min,
        age_max,
        price,
        instagram,
        siret,
        idUser,
        idCity
    } = req.body;

    const sql = `INSERT INTO boites
        (background, logo, name, location_link, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await db.query(sql, [background, logo, name, location_link, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCity]);

        res.status(201).json({ message: "Boîte créée", idClub: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   REMPLACER UNE BOÎTE ENTIÈREMENT
   PUT /api/boites/:id
   (tous les champs sont obligatoires)
   ========================== */

export async function replaceBoite(req, res) {

    const id = req.params.id;
    const { background, logo, name, location_link, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCity } = req.body;

    const sql = `UPDATE boites 
                 SET background = ?, logo = ?, name = ?, location_link = ?, description = ?, paragraph = ?, tags1 = ?, tags2 = ?, age_min = ?, age_max = ?, price = ?, instagram = ?, siret = ?, idUser = ?, idCity = ?
                 WHERE idClub = ?`;

    try {
        const [result] = await db.query(sql, [background, logo, name, location_link, description, paragraph, tags1, tags2, age_min, age_max, price, instagram, siret, idUser, idCity, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        res.json({ message: "Boîte remplacée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   MODIFIER UNE BOÎTE (partiellement)
   PATCH /api/boites/:id
   ========================== */

export async function updateBoite(req, res) {

    const id = req.params.id;

    const champsAutorises = ["background", "logo", "name", "location_link", "description", "paragraph", "tags1", "tags2", "age_min", "age_max", "price", "instagram", "siret", "idUser", "idCity"];

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

    const sql = `UPDATE boites SET ${champsAModifier.join(", ")} WHERE idClub = ?`;
    valeurs.push(id);

    try {
        const [result] = await db.query(sql, valeurs);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
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
        const [result] = await db.query("DELETE FROM boites WHERE idClub = ?", [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Boîte introuvable" });
            return;
        }

        res.json({ message: "Boîte supprimée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};