import { Request } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import Avatars from "@dicebear/avatars";
import initialsSprites from "@dicebear/avatars-initials-sprites";
import * as v from "validator";
import * as jwt from "jsonwebtoken";
import * as socketIO from "socket.io";
import { User } from "../entity/User";
import { Grade } from "../entity/Grade";
import {
    ACTIVE_CHAT_PAYLOAD, SocketEvent, USER_ONLINE_STATUS_PAYLOAD, USER_TYPING_STATUS_PAYLOAD,
} from "../entity/SocketEvent";
import { IExpress, IResponse } from "../interfaces/IExpress";

const avatars = new Avatars(initialsSprites, {});

class UserController {
    static async socketLogin(app: IExpress, socket: socketIO.Socket,
        d: { token: string }): Promise<void> {
        if (d.token) {
            const token = d.token.replace("Bearer ", "");
            let jwtPayload;
            try {
                jwtPayload = (jwt.verify(token, app.locals.config.JWT_SECRET) as any);
                const { userId } = jwtPayload;
                app.locals.sockets[userId] = { socket };
                const user = await getRepository(User).findOne(userId);
                socket.broadcast.emit(SocketEvent.USER_ONLINE_STATUS, {
                    userId,
                    online: true,
                } as USER_ONLINE_STATUS_PAYLOAD);
                socket.on(SocketEvent.USER_TYPING_STATUS, (typing: boolean) => {
                    // need to check
                    socket.broadcast.emit(SocketEvent.USER_TYPING_STATUS, {
                        username: user.name,
                        typing,
                    } as USER_TYPING_STATUS_PAYLOAD);
                });
                socket.on(SocketEvent.ACTIVE_CHAT, (payload: ACTIVE_CHAT_PAYLOAD) => {
                    app.locals.sockets[userId].activeChat = payload.chatId;
                });
                socket.on("disconnect", () => {
                    if (app.locals.sockets[userId]) {
                        delete app.locals.sockets[userId];
                        socket.broadcast.emit(SocketEvent.USER_ONLINE_STATUS, {
                            userId,
                            online: false,
                        } as USER_ONLINE_STATUS_PAYLOAD);
                    }
                });
            } catch (error) {
                // we can't use error here because it seems to be a reserved event...
                socket.emit("failure", i18n.__("errors.sessionExpired"));
            }
        }
    }
    public static async listAll(req: Request, res: IResponse): Promise<void> {
        const userRepository = getRepository(User);
        const users = await userRepository.find({ relations: ["grade"] });
        res.send(users);
    }

    public static async avatar(req: Request, res: IResponse): Promise<void> {
        const userRepository = getRepository(User);
        const { id } = req.params;
        if (!v.isUUID(id)) {
            res.status(404).send({ message: "Benutzer nicht gefunden!" });
            return;
        }
        try {
            const user = await userRepository.findOneOrFail(id);
            if (req.params.ext == "svg") {
                res.contentType("svg");
                res.send(avatars.create(user.name));
            } else {
                const parts = user.name.split(" ");
                res.redirect(`https://eu.ui-avatars.com/api/?name=${parts[0][0]}+${parts[parts.length - 1][0]}&size=512`);
            }
        } catch {
            res.status(404).send({ message: "Benutzer nicht gefunden!" });
        }
    }

    public static async newUser(req: Request, res: IResponse): Promise<void> {
        const { name, role, grade } = req.body;
        if (!(name && ["student", "teacher", "admin"].includes(role) && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const user = new User();
        user.name = name;
        user.password = req.app.locals.config.DEFAULT_PASSWORD;
        user.role = role;

        const userRepository = getRepository(User);
        const gradeRepository = getRepository(Grade);
        try {
            user.grade = await gradeRepository.findOneOrFail(grade);
        } catch {
            res.status(404).send({ message: "Grade not found!" });
            return;
        }
        user.hashPassword();

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async editUser(req: Request, res: IResponse): Promise<void> {
        const { id } = req.params;

        const { name, role, grade } = req.body;

        const userRepository = getRepository(User);
        const gradeRepository = getRepository(Grade);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.userNotFound") });
            return;
        }

        if (!(name && role && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        user.name = name;
        user.role = role;
        try {
            user.grade = await gradeRepository.findOneOrFail(grade);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.gradeNotFound") });
            return;
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }

        res.status(200).send({ success: true });
    }

    public static async deleteUser(req: Request, res: IResponse): Promise<void> {
        const { id } = req.params;

        const userRepository = getRepository(User);
        try {
            await userRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingUser") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default UserController;
