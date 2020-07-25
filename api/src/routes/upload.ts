import { Router } from "express";
import AssignmentsController from "../controllers/AssignmentsController";
import { checkJwt } from "../middlewares/checkJwt";
import * as multer from "multer";

const router = Router();

router.post("/assignments/:id/:type", [checkJwt, multer({ storage: multer.memoryStorage() }).single("file")], AssignmentsController.uploadFile);

export default router;
