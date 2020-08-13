import { Router } from "express";
import * as multer from "multer";
import FileController from "../controllers/FileController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/:bucket/:itemId/", [checkJwt], FileController.handle);
router.post("/:bucket/:itemId/upload", [checkJwt, multer({ storage: multer.memoryStorage() }).any()], FileController.handleUpload);
router.post("/:bucket/:itemId/download", [], FileController.handleDownload);
router.get("/:bucket/:itemId/serve", FileController.handleServe);
router.post("/:bucket/:itemId/save", FileController.handleSave);
router.get("/:bucket/:itemId/editKey", FileController.getEditKey);
router.post("/:bucket/:itemId/new/:path*", [checkJwt], FileController.newFile);
router.delete("/:bucket/:itemId/:path*", [checkJwt], FileController.deleteFile);

export default router;
