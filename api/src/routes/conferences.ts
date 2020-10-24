import { Router } from "express";
import ConferenceController from "../controllers/ConferenceController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/", [checkJwt], ConferenceController.createConference);

export default router;
