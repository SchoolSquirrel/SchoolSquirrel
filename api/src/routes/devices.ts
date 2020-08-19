import { Router } from "express";
import DeviceController from "../controllers/DeviceController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], DeviceController.listAll);
router.post("/", [checkJwt], DeviceController.newDevice);
router.delete("/:token", [checkJwt], DeviceController.deleteDevice);

export default router;
