/* eslint-disable max-len */
import { Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

class AuthController {
    /**
     * @apiDescription Login
     * @apiBodyParameter name | string | true | The username
     * @apiBodyParameter password | string | true | The password
     * @apiResponse 200 | OK | User
     * @apiResponse 401 | Wrong username or password | Error
     */
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

    /**
     * @apiDescription Renew JWT token
     * @apiBodyParameter jwtToken | string | true | The JWT token to renew
     * @apiResponse 200 | OK | User
     * @apiResponse 401 | Invalid token | Error
     */
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

    /**
     * @apiDescription Change password
     * @apiBodyParameter password | string | true | The new password
     * @apiBodyParameter oldPassword | string | false | The old password<br>If not specified, the operation will only be successfull when the default password has not been changed.
     * @apiResponse 200 | OK | Success
     * @apiResponse 400 | Password does not match criteria | Error
     * @apiResponse 500 | Server error | Error
     */
    public static async changePassword(req: Request, res: Response): Promise<void> {
        const { password }: {password: string} = req.body;
        try {
            if (!(password)) {
                res.status(400).end(JSON.stringify({ error: i18n.__("errors.notAllFieldsProvided") }));
                return;
            }
            if (password.length < 8) {
                res.status(400).send({ message: "Passwort zu kurz, es muss mindestens 8 Zeichen enthalten!" });
                return;
            }
            if (password.length > 25) {
                res.status(400).send({ message: "Passwort zu lang, es darf maximal 25 Zeichen enthalten!" });
                return;
            }
            if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
                res.status(400).send({ message: "Das Passwort muss Buchstaben und Zahlen enthalten!" });
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
