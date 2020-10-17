import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import CourseController from "../controllers/CourseController";
import { checkForTeacher } from "../middlewares/checkForTeacher";

const router = Router();

router.get("/", [checkJwt], CourseController.listAll);
router.get("/:id", [checkJwt], CourseController.getCourse);
router.post("/:id", [checkJwt, checkForTeacher], CourseController.editCourse);
router.post("/:id/chat", [checkJwt], CourseController.sendMessage);
router.post("/", [checkJwt, checkForTeacher], CourseController.newCourse);
router.delete("/:id", [checkJwt, checkForTeacher], CourseController.deleteCourse);

export default router;
