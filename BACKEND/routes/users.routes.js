import express from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    replaceUser,
    updateUser,
    deleteUser,
    loginUser
} from "../controllers/users.controller.js";

const router = express.Router();

// GET    /api/users        → tous les utilisateurs
// GET    /api/users/:id    → un utilisateur précis
// POST   /api/users        → créer un utilisateur
// POST   /api/users/login  → se connecter (renvoie un token)
// PUT    /api/users/:id    → remplacer un utilisateur
// PATCH  /api/users/:id    → modifier un utilisateur (partiellement)
// DELETE /api/users/:id    → supprimer un utilisateur

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/login", loginUser);
router.put("/:id", replaceUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;