import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Charge les variables définies dans le fichier .env
dotenv.config();

// Pool de connexions à la base de données MySQL (XAMPP)
// Les identifiants sont lus depuis le fichier .env
// pour ne jamais être écrits en clair dans le code
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Pool de connexions MySQL prêt !");

export default db;