import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Assignment } from "../entity/Assignment";

class EventController {
    public static listAll = async (req: Request, res: Response) => {
        const assignmentsRepository = getRepository(Assignment);
        const assignments = await assignmentsRepository.find();
        const events: {
            Id: number,
            Subject: string,
            StartTime: Date,
            EndTime: Date,
        }[] = [];
        events.push(...assignments.map((a) => {
            const startDate = new Date(a.due);
            startDate.setHours(startDate.getHours() - 12);
            return {
                Id: a.id,
                Subject: `${a.title} is due in 12 Hours`,
                StartTime: startDate,
                EndTime: a.due,
            };
        }));
        res.send(events);
    }
}

export default EventController;
