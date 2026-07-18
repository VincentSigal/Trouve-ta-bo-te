import express from "express";
import {
    getAllBoites,
    getBoiteById,
    createBoite,
    replaceBoite,
    updateBoite,
    deleteBoite,
    incrementerClics
} from "../controllers/boites.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET    /api/boites            → toutes les boîtes
// GET    /api/boites/:id        → une boîte précise
// POST   /api/boites            → créer une boîte (connecté + propriétaire ou admin)
// PUT    /api/boites/:id        → modifier une boîte (connecté + propriétaire ou admin)
// PATCH  /api/boites/:id        → modifier une boîte partiellement (connecté + propriétaire ou admin)
// DELETE /api/boites/:id        → supprimer une boîte (connecté + propriétaire ou admin)
// POST   /api/boites/:id/click  → incrémenter le compteur de clics

router.get("/", getAllBoites);
router.get("/:id", getBoiteById);
router.post("/", verifyToken, createBoite);
router.put("/:id", verifyToken, replaceBoite);
router.patch("/:id", verifyToken, updateBoite);
router.delete("/:id", verifyToken, deleteBoite);
router.post("/:id/click", incrementerClics);

export default router;