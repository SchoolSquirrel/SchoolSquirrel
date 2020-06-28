import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Grade } from "../entity/Grade";
import Avatars from "@dicebear/avatars";
import initialsSprites from "@dicebear/avatars-initials-sprites";
import { svg2png } from "svg-png-converter";

const avatars = new Avatars(initialsSprites, {});

class UserController {
    public static listAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        const users = await userRepository.find({relations: ["grade"]});
        res.send(users);
    }

    public static avatar = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(req.params.id);
        if (req.params.ext == "svg") {
            res.send(avatars.create(user.username));
        } else {
            res.contentType("png")
            res.send(await svg2png({
                input: avatars.create(user.username, {height: 100, width: 100}),
                encoding: "buffer",
                format: "png",
            }));
        }
    }

    public static newUser = async (req: Request, res: Response) => {
        const { name, role, grade } = req.body;
        if (!(name && ["student", "teacher", "admin"].includes(role) && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const user = new User();
        user.username = name;
        user.password = req.app.locals.config.DEFAULT_PASSWORD;
        user.role = role;

        const userRepository = getRepository(User);
        const gradeRepository = getRepository(Grade);
        user.grade = await gradeRepository.findOne(grade);

        user.hashPassword();

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static editUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const { name, role, grade } = req.body;

        const userRepository = getRepository(User);
        const gradeRepository = getRepository(Grade);
        let user;
        try {
            user = await userRepository.findOne(id);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.userNotFound") });
            return;
            return;
        }

        if (!(name && role && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        user.username = name;
        user.role = role;
        user.grade = await gradeRepository.findOne(grade);

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }

        res.status(200).send({ success: true });
    }

    public static deleteUser = async (req: Request, res: Response) => {

        const id = req.params.id;

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
