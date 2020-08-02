import { Router } from "express";
import FileController from "../controllers/FileController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/course/:courseId/", [checkJwt], FileController.handle);

export default router;
