import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository, createQueryBuilder } from "typeorm";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
class ChatController {
    public static listAll = async (req: Request, res: Response) => {
        const chatRepository = getRepository(Chat);
        const chats = await chatRepository.find({ relations: ["users"]});
        res.send(chats);
    }

    public static getChatFromUserId = async (req: Request, res: Response) => {
        const chatRepository = getRepository(Chat);
        const userRepository = getRepository(User);
        let chat = await chatRepository.query(`
        SELECT chat.* FROM chat
        WHERE chat.id = (
            SELECT c0.chatId FROM chat_users_user AS c0
            JOIN chat_users_user AS c1 ON c1.chatId = c0.chatId
            WHERE c0.userId = '${req.params.id}' AND c1.userId = '${res.locals.jwtPayload.userId}')`) as Chat; // HAVING COUNT(DISTINCT m3.name) = 2;
        chat = chat && chat[0] ? chat[0] : undefined;
        if (!chat) {
            chat = new Chat();
            chat.users = [];
            chat.users.push(await userRepository.findOne(req.params.id));
            chat.users.push(await userRepository.findOne(res.locals.jwtPayload.userId));
            chat = await chatRepository.save(chat);
        }
        res.send(chat);
    }

    public static getChat = async (req: Request, res: Response) => {
        const chatRepository = getRepository(Chat);
        try {
            const chat = await chatRepository.findOneOrFail(req.params.id, { relations: ["users"] });
            if (chat.users.length > 2) {
                // is a group chat
                chat.info = chat.users.map((u) => u.username).join(", ");
            } else {
                chat.info = `Last seen: ${"unknown"}`;
            }
            res.send(chat);
        } catch {
            res.status(404).send(i18n.__("errors.chatNotFound"));
        }
    }

    public static newGroupChat = async (req: Request, res: Response) => {
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
