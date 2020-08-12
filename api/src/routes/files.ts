import { Router } from "express";
import FileController from "../controllers/FileController";
import { checkJwt } from "../middlewares/checkJwt";
import multer = require("multer");

const router = Router();

router.post("/course/:courseId/", [checkJwt], FileController.handle);
router.post("/course/:courseId/upload", [checkJwt,  multer({ storage: multer.memoryStorage() }).any()], FileController.handleUpload);
router.post("/course/:courseId/download", [], FileController.handleDownload);
router.get("/course/:courseId/serve", FileController.handleServe);
router.post("/course/:courseId/save", FileController.handleSave);

export default router;
