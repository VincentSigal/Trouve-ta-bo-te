import db from "../config/db.js";
import bcrypt from "bcrypt";

const TOURS_DE_SALAGE = 10;

/* ==========================
   LIRE TOUS LES UTILISATEURS
   GET /api/users
   Le mot de passe n'est jamais renvoyé.
   ========================== */

export async function getAllUsers(req, res) {

    try {

        const sql = `SELECT users.idUser, users.email, users.date_inscription, users.newsletter, users.role, users.idCity,
                            owners_infos.firstName, owners_infos.lastName, owners_infos.phone
                     FROM users
                     LEFT JOIN owners_infos ON owners_infos.idUser = users.idUser`;

        const [results] = await db.query(sql);
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   LIRE UN SEUL UTILISATEUR
   GET /api/users/:id
   ========================== */

export async function getUserById(req, res) {

    const id = req.params.id;

    try {

        const sql = `SELECT users.idUser, users.email, users.date_inscription, users.newsletter, users.role, users.idCity,
                            owners_infos.firstName, owners_infos.lastName, owners_infos.phone
                     FROM users
                     LEFT JOIN owners_infos ON owners_infos.idUser = users.idUser
                     WHERE users.idUser = ?`;

        const [results] = await db.query(sql, [id]);

        if (results.length === 0) {
            res.status(404).json({ error: "Utilisateur introuvable" });
            return;
        }

        res.json(results[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   CRÉER UN UTILISATEUR
   POST /api/users
   Si role = "owner", firstName/lastName/phone
   sont obligatoires et créent la ligne owners_infos.
   ========================== */

export async function createUser(req, res) {

    const { email, password, newsletter, role, idCity, city, firstName, lastName, phone } = req.body;

    if (role === "owner" && (firstName === undefined || lastName === undefined || phone === undefined)) {
        res.status(400).json({ error: "firstName, lastName et phone sont obligatoires pour un owner" });
        return;
    }

    try {

        // idCity peut être fourni directement (id numérique),
        // ou un nom de ville à chercher/créer (formulaire d'inscription)
        let idCityFinal = idCity;

        if (idCityFinal === undefined && city !== undefined) {
            idCityFinal = await trouverOuCreerVille(city);
        }

        const passwordHash = await bcrypt.hash(password, TOURS_DE_SALAGE);

        const sql = `INSERT INTO users (email, password, newsletter, role, idCity)
                     VALUES (?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [email, passwordHash, newsletter, role, idCityFinal]);
        const idUser = result.insertId;

        if (role === "owner") {
            const sqlOwner = `INSERT INTO owners_infos (firstName, lastName, phone, idUser)
                               VALUES (?, ?, ?, ?)`;

            await db.query(sqlOwner, [firstName, lastName, phone, idUser]);
        }

        res.status(201).json({ message: "Utilisateur créé", idUser });

    } catch (err) {

        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Cet email est déjà utilisé" });
            return;
        }

        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   REMPLACER UN UTILISATEUR ENTIÈREMENT
   PUT /api/users/:id
   (tous les champs sont obligatoires,
   firstName/lastName/phone si role = "owner")
   ========================== */

export async function replaceUser(req, res) {

    const id = req.params.id;
    const { email, password, newsletter, role, idCity, firstName, lastName, phone } = req.body;

    if (role === "owner" && (firstName === undefined || lastName === undefined || phone === undefined)) {
        res.status(400).json({ error: "firstName, lastName et phone sont obligatoires pour un owner" });
        return;
    }

    try {

        const passwordHash = await bcrypt.hash(password, TOURS_DE_SALAGE);

        const sql = `UPDATE users
                     SET email = ?, password = ?, newsletter = ?, role = ?, idCity = ?
                     WHERE idUser = ?`;

        const [result] = await db.query(sql, [email, passwordHash, newsletter, role, idCity, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Utilisateur introuvable" });
            return;
        }

        await reconcilierOwnerInfos(id, role, { firstName, lastName, phone });

        res.json({ message: "Utilisateur remplacé" });

    } catch (err) {

        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Cet email est déjà utilisé" });
            return;
        }

        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   MODIFIER UN UTILISATEUR (partiellement)
   PATCH /api/users/:id
   ========================== */

export async function updateUser(req, res) {

    const id = req.params.id;

    const champsAutorises = ["email", "newsletter", "role", "idCity"];

    const champsAModifier = [];
    const valeurs = [];

    champsAutorises.forEach((champ) => {
        if (req.body[champ] !== undefined) {
            champsAModifier.push(`${champ} = ?`);
            valeurs.push(req.body[champ]);
        }
    });

    // Le mot de passe est traité à part car il doit être hashé
    if (req.body.password !== undefined) {
        const passwordHash = await bcrypt.hash(req.body.password, TOURS_DE_SALAGE);
        champsAModifier.push("password = ?");
        valeurs.push(passwordHash);
    }

    const concerneOwnerInfos =
        req.body.firstName !== undefined
        || req.body.lastName !== undefined
        || req.body.phone !== undefined
        || req.body.role !== undefined;

    if (champsAModifier.length === 0 && concerneOwnerInfos === false) {
        res.status(400).json({ error: "Aucun champ valide à modifier" });
        return;
    }

    try {

        if (champsAModifier.length > 0) {
            const sql = `UPDATE users SET ${champsAModifier.join(", ")} WHERE idUser = ?`;
            valeurs.push(id);

            const [result] = await db.query(sql, valeurs);

            if (result.affectedRows === 0) {
                res.status(404).json({ error: "Utilisateur introuvable" });
                return;
            }
        }

        // Si le rôle n'est pas envoyé dans cette requête,
        // on va chercher le rôle actuel en base pour savoir
        // s'il faut gérer owners_infos
        let role = req.body.role;

        if (role === undefined) {
            const [userActuel] = await db.query("SELECT role FROM users WHERE idUser = ?", [id]);

            if (userActuel.length === 0) {
                res.status(404).json({ error: "Utilisateur introuvable" });
                return;
            }

            role = userActuel[0].role;
        }

        const resultatOwner = await reconcilierOwnerInfos(id, role, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        });

        if (resultatOwner === "MANQUE_INFOS_OWNER") {
            res.status(400).json({ error: "firstName, lastName et phone sont obligatoires pour un owner" });
            return;
        }

        res.json({ message: "Utilisateur modifié" });

    } catch (err) {

        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Cet email est déjà utilisé" });
            return;
        }

        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


/* ==========================
   SUPPRIMER UN UTILISATEUR
   DELETE /api/users/:id
   ========================== */

export async function deleteUser(req, res) {

    const id = req.params.id;

    try {

        // On supprime d'abord owners_infos (table enfant)
        // sinon la clé étrangère bloque la suppression
        await db.query("DELETE FROM owners_infos WHERE idUser = ?", [id]);

        const [result] = await db.query("DELETE FROM users WHERE idUser = ?", [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Utilisateur introuvable" });
            return;
        }

        res.json({ message: "Utilisateur supprimé" });

    } catch (err) {

        if (err.code === "ER_ROW_IS_REFERENCED_2") {
            res.status(409).json({ error: "Impossible de supprimer : cet utilisateur possède encore des boîtes" });
            return;
        }

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
   RÉCONCILIE LA TABLE owners_infos
   AVEC LE RÔLE FINAL DE L'UTILISATEUR
   - role = "owner"     → crée ou met à jour owners_infos
   - role ≠ "owner"     → supprime owners_infos s'il existe
   Retourne "MANQUE_INFOS_OWNER" si firstName/lastName/phone
   sont nécessaires mais absents (nouvel owner sans infos).
   ========================== */

async function reconcilierOwnerInfos(idUser, role, { firstName, lastName, phone }) {

    if (role !== "owner") {
        await db.query("DELETE FROM owners_infos WHERE idUser = ?", [idUser]);
        return "OK";
    }

    const [ligneExistante] = await db.query("SELECT idOwner FROM owners_infos WHERE idUser = ?", [idUser]);

    if (ligneExistante.length === 0) {

        if (firstName === undefined || lastName === undefined || phone === undefined) {
            return "MANQUE_INFOS_OWNER";
        }

        const sql = `INSERT INTO owners_infos (firstName, lastName, phone, idUser)
                     VALUES (?, ?, ?, ?)`;

        await db.query(sql, [firstName, lastName, phone, idUser]);
        return "OK";
    }

    // La ligne existe déjà : on ne modifie que les champs fournis
    const champsAModifier = [];
    const valeurs = [];

    if (firstName !== undefined) {
        champsAModifier.push("firstName = ?");
        valeurs.push(firstName);
    }

    if (lastName !== undefined) {
        champsAModifier.push("lastName = ?");
        valeurs.push(lastName);
    }

    if (phone !== undefined) {
        champsAModifier.push("phone = ?");
        valeurs.push(phone);
    }

    if (champsAModifier.length > 0) {
        const sql = `UPDATE owners_infos SET ${champsAModifier.join(", ")} WHERE idUser = ?`;
        valeurs.push(idUser);

        await db.query(sql, valeurs);
    }

    return "OK";
};
