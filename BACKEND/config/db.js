import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Charge les variables définies dans le fichier .env
dotenv.config();

// Connexion à la base de données MySQL (XAMPP)
// Les identifiants sont lus depuis le fichier .env
// pour ne jamais être écrits en clair dans le code
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log("Connecté à la base de données MySQL !");

export default db;
