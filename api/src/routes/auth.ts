import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();
// Login route
router.post("/login", AuthController.login);

export default router;
