import { Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

class AuthController {
    public static async login(req: Request, res: Response): Promise<void> {
        const { name, password } = req.body;
        if (!(name && password)) {
            res.status(400).end(JSON.stringify({ error: i18n.__("errors.usernameOrPasswordEmpty") }));
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.createQueryBuilder("user")
                .addSelect("user.password")
                .where("user.name = :name", { name })
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
            { userId: user.id, name: user.name, role: user.role },
            req.app.locals.config.JWT_SECRET,
            { expiresIn: "1h" },
        );

        const response = {
            ...user,
            jwtToken: token,
            changePassword: password == res.app.locals.config.DEFAULT_PASSWORD,
        };
        response.password = undefined;

        // Send the jwt in the response
        res.send(response);
    }

    public static async renewToken(req: Request, res: Response): Promise<void> {
        const { jwtToken } = req.body;
        if (!(jwtToken)) {
            res.status(400).end(JSON.stringify({ error: i18n.__("errors.notAllFieldsProvided") }));
            return;
        }

        let jwtPayload;
        try {
            jwtPayload = (jwt.verify(jwtToken, req.app.locals.config.JWT_SECRET,
                { ignoreExpiration: true }) as any);
            i18n.setLocale(req.app.locals.config.DEFAULT_LANGUAGE);
        } catch (error) {
            res.status(401).send({ message: i18n.__("errors.unknownError") });
            return;
        }
        const { userId, name, role } = jwtPayload;
        const newToken = jwt.sign({ userId, name, role }, req.app.locals.config.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send the jwt in the response
        res.send({
            user: {
                id: userId,
                name,
                role,
                jwtToken: newToken,
            },
        });
    }

    public static async changePassword(req: Request, res: Response): Promise<void> {
        const { password } = req.body;
        try {
            if (!(password)) {
                res.status(400).end(JSON.stringify({ error: i18n.__("errors.notAllFieldsProvided") }));
                return;
            }
            const userRepository = getRepository(User);
            const user = await userRepository.createQueryBuilder("user")
                .addSelect("user.password")
                .where("user.id = :id", { id: res.locals.jwtPayload.userId })
                .getOne();

            if (user.checkIfUnencryptedPasswordIsValid(
                req.body.oldPassword || res.app.locals.config.DEFAULT_PASSWORD,
            )) {
                user.password = password;
                user.hashPassword();
                await userRepository.save(user);
                res.send({ success: true });
            } else {
                res.status(400).send({ message: "Altes Passwort nicht angegeben!" });
            }
        } catch (e) {
            res.status(500).send({ message: "Fehler!" });
        }
    }
}
export default AuthController;
