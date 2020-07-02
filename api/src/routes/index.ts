import { Router } from "express";
import auth from "./auth";
import users from "./users";
import admin from "./admin";
import courses from "./courses";
import events from "./events";
import chats from "./chats";
import assignments from "./assignments";

const routes = Router();

routes.use("/admin", admin);
routes.use("/assignments", assignments);
routes.use("/auth", auth);
routes.use("/users", users);
routes.use("/courses", courses);
routes.use("/events", events);
routes.use("/chats", chats);

export default routes;
