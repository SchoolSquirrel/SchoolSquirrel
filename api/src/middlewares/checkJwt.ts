import { NextFunction, Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export async function checkJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Get the jwt token from the head
    let token = req.headers.authorization as string;
    if (!token) {
        token = req.query.authorization;
    }
    if (!token || typeof token !== "string") {
        res.status(401).send({ message: i18n.__("errors.unauthorized") });
        return;
    }
    token = token.replace("Bearer ", "");
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = (jwt.verify(token, req.app.locals.config.JWT_SECRET) as any);
        res.locals.jwtPayload = jwtPayload;
        try {
            res.locals.jwtPayload.user = await getRepository(User)
                .findOneOrFail(res.locals.jwtPayload.userId);
        } catch {
            res.status(401).send({ message: i18n.__("errors.userNotFound"), logout: true });
        }
        i18n.setLocale(req.app.locals.config.DEFAULT_LANGUAGE);
    } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({ message: i18n.__("errors.sessionExpired"), logout: true });
        return;
    }

    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { userId, name, role } = jwtPayload;
    const newToken = jwt.sign({ userId, name, role }, req.app.locals.config.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.setHeader("Authorization", newToken);

    // Call the next middleware or controller
    next();
}
