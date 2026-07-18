import express from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    replaceEvent,
    updateEvent,
    deleteEvent
} from "../controllers/events.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET    /api/events       → toutes les soirées
// GET    /api/events/:id   → une soirée précise
// POST   /api/events       → créer une soirée (connecté + propriétaire de la boîte, ou admin)
// PUT    /api/events/:id   → remplacer une soirée (connecté + propriétaire ou admin)
// PATCH  /api/events/:id   → modifier une soirée partiellement (connecté + propriétaire ou admin)
// DELETE /api/events/:id   → supprimer une soirée (connecté + propriétaire ou admin)

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", verifyToken, createEvent);
router.put("/:id", verifyToken, replaceEvent);
router.patch("/:id", verifyToken, updateEvent);
router.delete("/:id", verifyToken, deleteEvent);

export default router;
