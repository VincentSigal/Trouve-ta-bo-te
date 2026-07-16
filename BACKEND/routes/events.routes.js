import express from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    replaceEvent,
    updateEvent,
    deleteEvent
} from "../controllers/events.controller.js";

const router = express.Router();

// GET    /api/events       → toutes les soirées
// GET    /api/events/:id   → une soirée précise
// POST   /api/events       → créer une soirée
// PUT    /api/events/:id   → remplacer une soirée
// PATCH  /api/events/:id   → modifier une soirée (partiellement)
// DELETE /api/events/:id   → supprimer une soirée

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", replaceEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
