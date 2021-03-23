import { NextFunction, Request } from "express";
import * as i18n from "i18n";
import { IResponse } from "../interfaces/IExpress";
import { isTeacher } from "../utils/roles";

export async function checkForTeacher(req: Request,
    res: IResponse, next: NextFunction): Promise<void> {
    if (await isTeacher(res.locals.jwtPayload.userId)) {
        next();
    } else {
        res.status(401).send({ message: i18n.__("errors.notAllowed") });
    }
}
