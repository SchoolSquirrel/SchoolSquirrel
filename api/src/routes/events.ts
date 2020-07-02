import { Router } from "express";
import EventController from "../controllers/EventController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], EventController.listAll);
router.post("/", [checkJwt], EventController.newEvent);
router.post("/:id", [checkJwt], EventController.updateEvent);
router.delete("/:id", [checkJwt], EventController.deleteEvent);

export default router;
