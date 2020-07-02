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

    public static updateEvent = async (req: Request, res: Response) => {
        const { Subject, StartTimezone, EndTimezone, RecurrenceRule, IsAllDay, Description, EndTime, Location, StartTime }: SchedulerEvent = req.body;
        if (!(Subject && EndTime && StartTime)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }
        const eventRepository = getRepository(Event);
        try {
            const event = await eventRepository.findOneOrFail(req.params.id);
            event.Subject = Subject;
            event.StartTimezone = StartTimezone;
            event.EndTimezone = EndTimezone;
            event.RecurrenceRule = RecurrenceRule;
            event.IsAllDay = IsAllDay;
            event.Description = Description;
            event.EndTime = EndTime;
            event.Location = Location;
            event.StartTime = StartTime;
            await eventRepository.save(event);
        } catch {
            res.status(400).send({ message: i18n.__("errors.eventNotFound") });
            return;
        }
        res.send({ success: true });
    }

    public static deleteEvent = async (req: Request, res: Response) => {
        const id = req.params.id;
        const eventRepository = getRepository(Event);
        try {
            await eventRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingEvent") });
            return;
        }
        res.status(200).send({ success: true });
    }
}

export default EventController;
