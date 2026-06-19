const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Connexion à la base de données MySQL (XAMPP)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "trouve_ta_boite" // ← remplace par le vrai nom
});

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base :", err);
        return;
    }
    console.log("Connecté à la base de données MySQL !");
});

// Route pour récupérer toutes les boîtes
app.get("/api/boites", (req, res) => {
    db.query("SELECT * FROM boites", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur serveur" });
            return;
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});