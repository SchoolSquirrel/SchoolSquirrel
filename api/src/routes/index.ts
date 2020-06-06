import { Router } from "express";
import auth from "./auth";
import user from "./user";
import admin from "./admin";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/admin", admin);

export default routes;
