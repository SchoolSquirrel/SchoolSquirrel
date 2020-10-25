import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
import { Course } from "../entity/Course";
import { ActivityType } from "../entity/Activity";
import { createActivity } from "./activities";

function getOtherUserInPrivateChat(userId: string, chat: Chat): User {
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
    const messageRepository = getRepository(Message);
    let message = new Message();
    message.text = text;
    try {
        if (type == "chat") {
            message.chat = await getRepository(Chat).findOneOrFail(req.params.id, { relations: ["users"] });
        } else if (type == "course") {
            message.course = await getRepository(Course).findOneOrFail(req.params.id);
        }
    } catch {
        res.status(404).send({ message: "Chat not found!" });
        return;
    }
    message.sender = res.locals.jwtPayload.user;
    message.date = new Date();
    message.citation = citation;
    message = await messageRepository.save(message);
    res.send(message);
    (async () => {
        if (type == "chat") {
            if (!isGroupChat(message.chat)) {
                createActivity(
                    [getOtherUserInPrivateChat(res.locals.jwtPayload.userId, message.chat)],
                    ActivityType.CHAT_MESSAGE, message, {
                        title: message.sender.name,
                        body: message.text,
                    }, {
                        type: ActivityType.CHAT_MESSAGE,
                        thumbnail: `users/${res.locals.jwtPayload.userId}.png`,
                        image: `users/${res.locals.jwtPayload.userId}.png`,
                        channel: "Chat Nachrichten",
                    },
                );
            } else {
                createActivity(message.chat.users, ActivityType.CHAT_MESSAGE, message, {
                    title: getGroupChatName(message.chat),
                    body: message.text,
                }, {
                    type: ActivityType.CHAT_MESSAGE,
                    channel: "Chat Nachrichten",
                });
            }
        }
    })();
}
