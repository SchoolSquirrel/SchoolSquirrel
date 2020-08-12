import { Router } from "express";
import * as multer from "multer";
import AssignmentsController from "../controllers/AssignmentsController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/assignments/:id/:type", [checkJwt, multer({ storage: multer.memoryStorage() }).single("file")], AssignmentsController.uploadFile);

export default router;
