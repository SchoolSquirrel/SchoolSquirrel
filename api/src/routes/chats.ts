import { Router } from "express";
import ChatController from "../controllers/ChatController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], ChatController.listAll);
router.get("/:id", [checkJwt], ChatController.getChat);
router.get("/user/:id", [checkJwt], ChatController.getChatFromUserId);
router.post("/", [checkJwt], ChatController.newGroupChat);
// router.delete("/:id([0-9]+)", [checkJwt], ChatController.deleteChat);

export default router;
