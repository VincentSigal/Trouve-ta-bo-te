import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import boitesRoutes from "./routes/boites.routes.js";
import usersRoutes from "./routes/users.routes.js";
import eventsRoutes from "./routes/events.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Toutes les routes commençant par /api/boites
// sont gérées dans le fichier boites.routes.js
app.use("/api/boites", boitesRoutes);

// Toutes les routes commençant par /api/users
// sont gérées dans le fichier users.routes.js
app.use("/api/users", usersRoutes);

// Toutes les routes commençant par /api/events
// sont gérées dans le fichier events.routes.js
app.use("/api/events", eventsRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});