import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
class ChatController {
    public static listAll = async (req: Request, res: Response) => {
        const chatRepository = getRepository(Chat);
        const chats = await chatRepository.find({ relations: ["users"]});
        res.send(chats);
    }

    public static newChat = async (req: Request, res: Response) => {
        const { name, user } = req.body;
        if (!(name && user)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const chat = new Chat();
        chat.name = name;
        chat.users = [];
        const userRepository = getRepository(User);
        chat.users.push(await userRepository.findOne(res.locals.jwtPayload.userId));
        chat.users.push(await userRepository.findOne(req.params.user));
        const chatRepository = getRepository(Chat);
        try {
            await chatRepository.save(chat);
        } catch (e) {
            res.status(400).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static deleteChat = async (req: Request, res: Response) => {
        const id = req.params.id;
        const chatRepository = getRepository(Chat);
        try {
            await chatRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingChat") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default ChatController;
