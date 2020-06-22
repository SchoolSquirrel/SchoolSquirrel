import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import AssignmentsController from "../controllers/AssignmentsController";

const router = Router();

router.get("/", [checkJwt], AssignmentsController.listAll);
router.get("/:id", [checkJwt], AssignmentsController.getAssignment);
router.post("/", [checkJwt], AssignmentsController.newAssignment);
// router.post("/:id", [checkJwt], AssignmentsController.editAssignment);
router.delete("/:id", [checkJwt], AssignmentsController.deleteAssignment);

export default router;
