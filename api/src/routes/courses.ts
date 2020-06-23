import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import CourseController from "../controllers/CourseController";
import { checkForTeacher } from "../middlewares/checkForTeacher";

const router = Router();

router.get("/", [checkJwt], CourseController.listAll);
router.post("/", [checkJwt, checkForTeacher], CourseController.newCourse);
router.delete("/:id([0-9]+)", [checkJwt, checkForTeacher], CourseController.deleteCourse);

export default router;
