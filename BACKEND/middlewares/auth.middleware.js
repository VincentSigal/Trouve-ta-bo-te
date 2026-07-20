import jwt from "jsonwebtoken";

/* ==========================
   VÉRIFIE LE TOKEN JWT
   Attendu dans le header : Authorization: Bearer <token>
   Si valide, ajoute req.user = { idUser, role }
   et laisse passer la requête vers la route suivante.
   ========================== */

export function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (authHeader === undefined) {
        res.status(401).json({ error: "Non authentifié" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (token === undefined) {
        res.status(401).json({ error: "Non authentifié" });
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();

    } catch (err) {
        res.status(401).json({ error: "Token invalide ou expiré" });
    }
};