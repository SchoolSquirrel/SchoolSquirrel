import { Request } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import * as v from "validator";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
import { IResponse } from "../interfaces/IExpress";
import { sendMessage } from "../utils/messages";

class ChatController {
    /**
     * @apiDescription List all chats
     * @apiResponse 200 | OK | Chat[]
     */
    public static async listAll(req: Request, res: IResponse): Promise<void> {
        const chatRepository = getRepository(Chat);
        const chats = await chatRepository.find({ relations: ["users"] });
        res.send(chats);
    }

    /**
     * @apiDescription Get chat from user id
     * @apiResponse 200 | OK | Chat
     * @apiResponse 404 | Chat not found | Error
     */
    public static async getChatFromUserId(req: Request, res: IResponse): Promise<void> {
        const chatRepository = getRepository(Chat);
        const userRepository = getRepository(User);
        const { id } = req.params;
        if (!v.isUUID(id)) {
            res.status(404).send({ message: "Chat nicht gefunden!" });
            return;
        }
        let chat = await chatRepository.query(`
        SELECT chat.* FROM chat
        WHERE chat.id = (
            SELECT c0.chatId FROM chat_users_user AS c0
            JOIN chat_users_user AS c1 ON c1.chatId = c0.chatId
            WHERE c0.userId = '${id}' AND c1.userId = '${res.locals.jwtPayload.userId}')`) as Chat; // HAVING COUNT(DISTINCT m3.name) = 2;
        chat = chat && chat[0] ? chat[0] : undefined;
        if (!chat) {
            chat = new Chat();
            chat.users = [];
            try {
                chat.users.push(await userRepository.findOneOrFail(req.params.id));
            } catch {
                res.status(404).send({ message: "User not found!" });
                return;
            }
            chat.users.push(res.locals.jwtPayload.user);
            chat = await chatRepository.save(chat);
        }
        res.send(chat);
    }

    /**
     * @apiDescription Send a chat message
     * @apiBodyParameter text | string | true | The message content
     * @apiBodyParameter citation | number | false | An optional id of a message to cite
     * @apiResponse 200 | OK | Message
     * @apiResponse 500 | Missing fields | Error
     */
    public static async sendMessage(req: Request, res: IResponse): Promise<void> {
        sendMessage(req, res, "chat");
    }

    /**
     * @apiDescription Get chat
     * @apiResponse 200 | OK | Chat
     * @apiResponse 404 | Chat not found | Error
     */
    public static async getChat(req: Request, res: IResponse): Promise<void> {
        const chatRepository = getRepository(Chat);
        try {
            const { id } = req.params;
            if (!v.isUUID(id)) {
                res.status(404).send({ message: "Chat nicht gefunden!" });
                return;
            }
            const chat = await chatRepository.findOneOrFail(id, { relations: ["users", "messages", "messages.sender"] });
            if (chat.users.length > 2) {
                // is a group chat
                chat.info = chat.users.map((u) => u.name).join(", ");
            } else {
                chat.info = `Last seen: ${"unknown"}`;
            }
            chat.messages = chat.messages.sort((a, b) => a.date.getTime() - b.date.getTime());
            res.send(chat);
        } catch {
            res.status(404).send(i18n.__("errors.chatNotFound"));
        }
    }

    /**
     * @apiDescription Create a new group chat
     * @apiBodyParameter name | string | true | The name for the new chat
     * @apiBodyParameter user | string | true | The id of another user
     * @apiResponse 200 | OK | Success
     * @apiResponse 400 | Missing fields | Error
     */
    public static async newGroupChat(req: Request, res: IResponse): Promise<void> {
        const { name, user } = req.body;
        if (!(name && user)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const chat = new Chat();
        chat.name = name;
        chat.users = [];
        const userRepository = getRepository(User);
        chat.users.push(res.locals.jwtPayload.user);
        try {
            chat.users.push(await userRepository.findOneOrFail(req.params.user));
        } catch {
            res.status(404).send({ message: "User not found!" });
            return;
        }
        const chatRepository = getRepository(Chat);
        try {
            await chatRepository.save(chat);
        } catch (e) {
            res.status(400).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.status(200).send({ success: true });
    }

    /**
     * @apiDescription Delete chat
     * @apiResponse 200 | OK | Success
     * @apiResponse 500 | Server Error | Error
     */
    public static async deleteChat(req: Request, res: IResponse): Promise<void> {
        const { id } = req.params;
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
