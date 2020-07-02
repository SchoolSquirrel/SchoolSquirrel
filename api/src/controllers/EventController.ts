import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Assignment } from "../entity/Assignment";
import { Event } from "../entity/Event";
import { SchedulerEvent } from "../entity/SchedulerEvent";
import { User } from "../entity/User";

class EventController {
    public static listAll = async (req: Request, res: Response) => {
        const assignmentsRepository = getRepository(Assignment);
        const eventRepository = getRepository(Event);
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
        events.push(...await eventRepository.find());
        res.send(events);
    }

    public static newEvent = async (req: Request, res: Response) => {
        const { Subject, StartTimezone, EndTimezone, RecurrenceRule, IsAllDay, Description, EndTime, Location, StartTime }: SchedulerEvent = req.body;
        if (!(Subject && EndTime && StartTime)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const event = new Event();
        event.Subject = Subject;
        event.StartTimezone = StartTimezone;
        event.EndTimezone = EndTimezone;
        event.RecurrenceRule = RecurrenceRule;
        event.IsAllDay = IsAllDay;
        event.Description = Description;
        event.EndTime = EndTime;
        event.Location = Location;
        event.StartTime = StartTime;
        const userRepository = getRepository(User);
        event.user = await userRepository.findOne(res.locals.jwtPayload.userId);
        const eventRepository = getRepository(Event);
        try {
            await eventRepository.save(event);
        } catch (e) {
            res.status(400).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.redirect("events");
    }
}

export default EventController;
