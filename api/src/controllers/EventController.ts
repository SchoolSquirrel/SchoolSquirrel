import { Request } from "express";
import { getRepository } from "typeorm";
import * as i18n from "i18n";
import { Assignment } from "../entity/Assignment";
import { Event } from "../entity/Event";
import { SchedulerEvent } from "../entity/SchedulerEvent";
import { EventCategory } from "../entity/EventCategory";
import { HolidayData } from "../entity/Holiday";
import { IResponse } from "../interfaces/IExpress";

class EventController {
    public static async listAll(req: Request, res: IResponse): Promise<void> {
        const assignmentsRepository = getRepository(Assignment);
        const eventRepository = getRepository(Event);
        const assignments = await assignmentsRepository
            .createQueryBuilder("assignment")
            .leftJoin("assignment.course", "course")
            .leftJoin("course.students", "user")
            .where("user.id = :id", { id: res.locals.jwtPayload.userId })
            .getMany();
        const events: {
            Id: string,
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
                user: res.locals.jwtPayload.user,
            },
        });
        for (const event of userEvents) {
            event.Category = EventCategory.UserEvent;
            events.push(event);
            for (const key of Object.keys(event)) {
                if (event[key] === null) {
                    delete event[key];
                }
            }
        }
        for (const year of Object.values(res.app.locals.holidays as HolidayData)) {
            events.push(...year.map((e) => ({
                Id: undefined,
                StartTime: e.startDate,
                EndTime: e.endDate,
                IsAllDay: true,
                IsReadonly: true,
                Subject: e.name,
                Category: e.isVacation ? EventCategory.Vacation : EventCategory.Holiday,
            })));
        }
        res.send(events);
    }

    public static async newEvent(req: Request, res: IResponse): Promise<void> {
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
        event.user = res.locals.jwtPayload.user;
        const eventRepository = getRepository(Event);
        try {
            await eventRepository.save(event);
        } catch (e) {
            res.status(400).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.redirect("events");
    }

    public static async updateEvent(req: Request, res: IResponse): Promise<void> {
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

    public static async deleteEvent(req: Request, res: IResponse): Promise<void> {
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
