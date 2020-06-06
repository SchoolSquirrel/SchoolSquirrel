import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkForAdmin } from "../middlewares/checkForAdmin";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// router.get("/", [checkJwt], UserController.listAll);
// router.post("/", [checkJwt, checkForAdmin()], UserController.newUser);
// router.post("/editCurrent", [checkJwt], UserController.editCurrent);
// router.delete("/:id([0-9]+)", [checkJwt, checkForAdmin()], UserController.deleteUser);

export default router;
