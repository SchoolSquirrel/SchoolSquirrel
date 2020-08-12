import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], UserController.listAll);
router.get("/:id.:ext", [checkJwt], UserController.avatar);
// router.post("/", [checkJwt, checkForAdmin()], UserController.newUser);
// router.post("/editCurrent", [checkJwt], UserController.editCurrent);
// router.delete("/:id([0-9]+)", [checkJwt, checkForAdmin()], UserController.deleteUser);

export default router;
