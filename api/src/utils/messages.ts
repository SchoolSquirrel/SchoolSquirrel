import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
import { Course } from "../entity/Course";

export async function sendMessage(req: Request, res: Response, type: "chat" | "course") {
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
    message.chat = await getRepository(Chat).findOne(req.params.id);
  } else if (type == "course") {
    message.course = await getRepository(Course).findOne(req.params.id);
  }
  message.sender = await userRepository.findOne(res.locals.jwtPayload.userId);
  message.date = new Date();
  message.citation = citation;
  message = await messageRepository.save(message);
  res.send(message);
}