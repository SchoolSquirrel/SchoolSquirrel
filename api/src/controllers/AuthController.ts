import { Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

class AuthController {

    public static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).end(JSON.stringify({ error: i18n.__("errors.usernameOrPasswordEmpty") }));
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.createQueryBuilder("user")
                .addSelect("user.password")
                .where("user.username = :username", { username })
                .getOne();
        } catch (error) {
            res.status(401).end(JSON.stringify({ message: i18n.__("errors.wrongUsername") }));
        }

        if (!user) {
            res.status(401).end(JSON.stringify({ message: i18n.__("errors.wrongUsername") }));
            return;
        }
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).end(JSON.stringify({ message: i18n.__("errors.wrongPassword") }));
            return;
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            req.app.locals.config.JWT_SECRET,
            { expiresIn: "1h" },
        );

        const response = {
            ...user,
            jwtToken: token,
        };
        response.password = undefined;

        // Send the jwt in the response
        res.send(response);
    }

    public static renewToken = async (req: Request, res: Response) => {
        const { jwtToken } = req.body;
        if (!(jwtToken)) {
            res.status(400).end(JSON.stringify({ error: i18n.__("errors.notAllFieldsProvided") }));
            return;
        }

        let jwtPayload;
        try {
            jwtPayload = (jwt.verify(jwtToken, req.app.locals.config.JWT_SECRET, { ignoreExpiration: true }) as any);
            i18n.setLocale(req.app.locals.config.DEFAULT_LANGUAGE);
        } catch (error) {
            res.status(401).send({ message: i18n.__("errors.unknownError") });
            return;
        }
        const { userId, username } = jwtPayload;
        const newToken = jwt.sign({ userId, username }, req.app.locals.config.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send the jwt in the response
        res.send({
            user: {
                id: userId,
                username,
                jwtToken: newToken,
        } });
    }
}
export default AuthController;
