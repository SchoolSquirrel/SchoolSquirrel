import { Router } from "express";
import auth from "./auth";
import users from "./users";
import admin from "./admin";
import courses from "./courses";
import events from "./events";
import chats from "./chats";
import assignments from "./assignments";
import files from "./files";
import devices from "./devices";
import conferences from "./conferences";

const routes = Router();

routes.use("/admin", admin);
routes.use("/files", files);
routes.use("/assignments", assignments);
routes.use("/auth", auth);
routes.use("/users", users);
routes.use("/courses", courses);
routes.use("/conferences", conferences);
routes.use("/events", events);
routes.use("/chats", chats);
routes.use("/devices", devices);

export default routes;
