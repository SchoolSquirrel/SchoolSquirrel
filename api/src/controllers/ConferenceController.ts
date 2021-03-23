import { Request } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Conference } from "../entity/Conference";
import { User } from "../entity/User";
import { IResponse } from "../interfaces/IExpress";

class ConferenceController {
    public static async createConference(req: Request, res: IResponse): Promise<void> {
        const { type, users }: {type: "private" | "group" | "course", users: number[]} = req.body;
        const conferenceRepository = getRepository(Conference);
        const userRepository = getRepository(User);
        try {
            const conference = new Conference();
            conference.type = type;
            conference.users = [];
            for (const user of users) {
                conference.users.push(await userRepository.findOneOrFail(user));
            }
            conference.users.push(res.locals.jwtPayload.user);
            res.send(await conferenceRepository.save(conference));
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileCreatingConference") });
        }
    }
}

export default ConferenceController;
