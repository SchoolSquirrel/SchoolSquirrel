import { NextFunction, Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export async function checkForTeacher(req: Request,
    res: Response, next: NextFunction): Promise<void> {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(User);
    let user: User;
    try {
        user = await userRepository.findOneOrFail(id);
    } catch {
        res.status(401).send({ message: i18n.__("errors.userNotFound"), logout: true });
    }

    if (user && (user.role == "admin" || user.role == "teacher")) {
        next();
    } else {
        res.status(401).send({ message: i18n.__("errors.notAllowed") });
    }
}
