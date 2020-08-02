import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import AssignmentsController from "../controllers/AssignmentsController";
import { checkForTeacher } from "../middlewares/checkForTeacher";

const router = Router();

router.get("/", [checkJwt], AssignmentsController.listCoursesWithAssignments);
router.get("/draft", [checkJwt, checkForTeacher], AssignmentsController.getAssignmentDraft);
router.post("/draft", [checkJwt, checkForTeacher], AssignmentsController.saveAssignmentDraft);
router.get("/:id", [checkJwt], AssignmentsController.getAssignment);
router.post("/", [checkJwt], AssignmentsController.newAssignment);
// router.post("/:id", [checkJwt], AssignmentsController.editAssignment);
router.delete("/:id", [checkJwt], AssignmentsController.deleteAssignment);
router.delete("/:id/:type/:file", [checkJwt], AssignmentsController.deleteFile);

export default router;
