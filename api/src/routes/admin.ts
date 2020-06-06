import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkForAdmin } from "../middlewares/checkForAdmin";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/users", [checkJwt, checkForAdmin], UserController.listAll);
router.post("/users", [checkJwt, checkForAdmin], UserController.newUser);

export default router;
