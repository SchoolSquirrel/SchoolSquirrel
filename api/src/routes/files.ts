import { Router } from "express";
import FileController from "../controllers/FileController";
import { checkJwt } from "../middlewares/checkJwt";
import multer = require("multer");

const router = Router();

router.post("/:bucket/:courseId/", [checkJwt], FileController.handle);
router.post("/:bucket/:courseId/upload", [checkJwt,  multer({ storage: multer.memoryStorage() }).any()], FileController.handleUpload);
router.post("/:bucket/:courseId/download", [], FileController.handleDownload);
router.get("/:bucket/:courseId/serve", FileController.handleServe);
router.post("/:bucket/:courseId/save", FileController.handleSave);
router.get("/:bucket/:courseId/editKey", FileController.getEditKey);

export default router;
