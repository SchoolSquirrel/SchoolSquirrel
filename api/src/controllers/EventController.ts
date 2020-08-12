import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as i18n from "i18n";
import { Assignment } from "../entity/Assignment";
import { Event } from "../entity/Event";
import { SchedulerEvent } from "../entity/SchedulerEvent";
import { User } from "../entity/User";
import { EventCategory } from "../entity/EventCategory";

class EventController {
    public static async listAll(req: Request, res: Response): Promise<void> {
        const assignmentsRepository = getRepository(Assignment);
        const eventRepository = getRepository(Event);
        const assignments = await assignmentsRepository
            .createQueryBuilder("assignment")
            .leftJoin("assignment.course", "course")
            .leftJoin("course.students", "user")
            .where("user.id = :id", { id: res.locals.jwtPayload.userId })
            .getMany();
        const events: {
            Id: number,
            Subject: string,
            StartTime: Date,
            EndTime: Date,
        }[] = [];
        events.push(...assignments.map((a) => ({
            Id: a.id,
            Subject: `"${a.title}" is due (${a.due.getHours()}:${a.due.getMinutes()})`,
            StartTime: a.due,
            EndTime: a.due,
            Category: EventCategory.Assignment,
            IsReadonly: true,
            IsAllDay: true,
        } as SchedulerEvent)));
        const userEvents = await eventRepository.find({
            where: {
                user: await getRepository(User).findOne(res.locals.jwtPayload.userId),
            },
        });
        for (const event of userEvents) {
            event.Category = EventCategory.UserEvent;
            events.push(event);
        }
        res.send(events);
    }

    public static async newEvent(req: Request, res: Response): Promise<void> {
        const {
            Subject, StartTimezone, EndTimezone, RecurrenceRule,
            IsAllDay, Description, EndTime, Location, StartTime,
        }: SchedulerEvent = req.body;
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

    public static async updateEvent(req: Request, res: Response): Promise<void> {
        const {
            Subject, StartTimezone, EndTimezone, RecurrenceRule,
            IsAllDay, Description, EndTime, Location, StartTime,
        }: SchedulerEvent = req.body;
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

    public static async deleteEvent(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
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
