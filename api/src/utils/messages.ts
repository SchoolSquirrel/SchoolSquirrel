import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
import { Course } from "../entity/Course";
import { sendPushNotification } from "./notifications";
import { NotificationCategory } from "../entity/NotificationCategory";

function getOtherUserInPrivateChat(userId: number, chat: Chat): User {
    return chat.users.filter((u) => u.id != userId)[0];
}

function isGroupChat(chat: Chat): boolean {
    return chat.users.length > 2;
}

function getGroupChatName(chat: Chat): string {
    return chat.name ? chat.name : chat.users.map((u) => u.name.split(" ")[0]).join(", ");
}

export async function sendMessage(req: Request, res: Response, type: "chat" | "course"): Promise<void> {
    const { text, citation } = req.body;
    if (!text) {
        res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
        return;
    }
    const userRepository = getRepository(User);
    const messageRepository = getRepository(Message);
    let message = new Message();
    message.text = text;
    if (type == "chat") {
        message.chat = await getRepository(Chat).findOne(req.params.id, { relations: ["users"] });
    } else if (type == "course") {
        message.course = await getRepository(Course).findOne(req.params.id);
    }
    message.sender = await userRepository.findOne(res.locals.jwtPayload.userId);
    message.date = new Date();
    message.citation = citation;
    message = await messageRepository.save(message);
    res.send(message);
    (async () => {
        if (type == "chat") {
            if (!isGroupChat(message.chat)) {
                sendPushNotification(
                    getOtherUserInPrivateChat(res.locals.jwtPayload.userId, message.chat), {
                        title: message.sender.name,
                        body: message.text,
                    }, {
                        type: NotificationCategory.ChatMessage,
                        thumbnail: `users/${res.locals.jwtPayload.userId}.png`,
                        image: `users/${res.locals.jwtPayload.userId}.png`,
                        channel: "Chat Nachrichten",
                    },
                );
            } else {
                for (const user of message.chat.users) {
                    sendPushNotification(
                        user,
                        {
                            title: getGroupChatName(message.chat),
                            body: message.text,
                        }, {
                            type: NotificationCategory.ChatMessage,
                            channel: "Chat Nachrichten",
                        },
                    );
                }
            }
        }
    })();
}
