import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkForAdmin } from "../middlewares/checkForAdmin";
import { checkJwt } from "../middlewares/checkJwt";
import GradeController from "../controllers/GradeController";

const router = Router();

router.get("/users", [checkJwt, checkForAdmin], UserController.listAll);
router.post("/users", [checkJwt, checkForAdmin], UserController.newUser);
router.post("/users/:id", [checkJwt, checkForAdmin], UserController.editUser);
router.get("/grades", [checkJwt, checkForAdmin], GradeController.listAll);
router.post("/grades", [checkJwt, checkForAdmin], GradeController.newGrade);

export default router;
