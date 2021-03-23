import { Router } from "express";
import * as multer from "multer";
import FileController from "../controllers/FileController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/:bucket/:itemId", [checkJwt], FileController.listFiles);
router.post("/:bucket/:itemId/upload", [checkJwt, multer({ storage: multer.memoryStorage() }).any()], FileController.handleUpload);
router.post("/:bucket/:itemId/download", [checkJwt], FileController.handleDownload);
router.get("/:bucket/:itemId/serve", [checkJwt], FileController.handleServe);
router.post("/:bucket/:itemId/save", [checkJwt], FileController.handleSave);
router.get("/:bucket/:itemId/editKey", [checkJwt], FileController.getEditKey);
router.get("/:bucket/:itemId/:path*", [checkJwt], FileController.getFile);
router.post("/:bucket/:itemId/new/:path*", [checkJwt], FileController.newFile);
router.delete("/:bucket/:itemId/:path*", [checkJwt], FileController.deleteFile);

export default router;
