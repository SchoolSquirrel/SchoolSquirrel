import { Router } from "express";
import FileController from "../controllers/FileController";
import { checkJwt } from "../middlewares/checkJwt";
import multer = require("multer");

const router = Router();

router.post("/:bucket/:itemId/", [checkJwt], FileController.handle);
router.post("/:bucket/:itemId/upload", [checkJwt, multer({ storage: multer.memoryStorage() }).any()], FileController.handleUpload);
router.post("/:bucket/:itemId/download", [], FileController.handleDownload);
router.get("/:bucket/:itemId/serve", FileController.handleServe);
router.post("/:bucket/:itemId/save", FileController.handleSave);
router.get("/:bucket/:itemId/editKey", FileController.getEditKey);

export default router;
