import { Router } from "express";
import auth from "./auth";
import user from "./user";
import admin from "./admin";
import assignments from "./assignments";

const routes = Router();

routes.use("/admin", admin);
routes.use("/assignments", assignments);
routes.use("/auth", auth);
routes.use("/users", user);

export default routes;
