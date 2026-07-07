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

const router = express.Router();

// GET    /api/boites            → toutes les boîtes
// GET    /api/boites/:id        → une boîte précise
// POST   /api/boites            → créer une boîte
// PUT    /api/boites/:id        → modifier une boîte
// PATCH  /api/boites/:id        → modifier une boîte (partiellement)
// DELETE /api/boites/:id        → supprimer une boîte
// POST   /api/boites/:id/click  → incrémenter le compteur de clics

router.get("/", getAllBoites);
router.get("/:id", getBoiteById);
router.post("/", createBoite);
router.put("/:id", replaceBoite);
router.patch("/:id", updateBoite);
router.delete("/:id", deleteBoite);
router.post("/:id/click", incrementerClics);

export default router;