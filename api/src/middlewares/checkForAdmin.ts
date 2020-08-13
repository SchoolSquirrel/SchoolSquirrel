import { NextFunction, Request, Response } from "express";
import * as i18n from "i18n";
import { isAdmin } from "../utils/roles";

export async function checkForAdmin(req: Request,
    res: Response, next: NextFunction): Promise<void> {
    if (await isAdmin(res.locals.jwtPayload.userId)) {
        next();
    } else {
        res.status(401).send({ message: i18n.__("errors.notAllowed") });
    }
}
