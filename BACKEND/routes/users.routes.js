import express from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    replaceUser,
    updateUser,
    deleteUser
} from "../controllers/users.controller.js";

const router = express.Router();

// GET    /api/users       → tous les utilisateurs
// GET    /api/users/:id   → un utilisateur précis
// POST   /api/users       → créer un utilisateur
// PUT    /api/users/:id   → remplacer un utilisateur
// PATCH  /api/users/:id   → modifier un utilisateur (partiellement)
// DELETE /api/users/:id   → supprimer un utilisateur

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", replaceUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;