import { SchedulerEvent } from "./SchedulerEvent";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from "typeorm";
import { User } from "./User";
import { EventCategory } from "./EventCategory";

@Entity()
export class Event implements SchedulerEvent {
    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public Subject: string;

    @Column()
    public Description: string;

    @Column()
    public Location: string;

    @Column()
    public StartTime: Date;

    @Column()
    public EndTime: Date;

    @Column()
    public IsAllDay: boolean;

    @Column()
    public StartTimezone: string;

    @Column()
    public EndTimezone: string;

    @Column()
    public RecurrenceRule: string;

    @ManyToOne(() => User, (user) => user.events)
    public user: User;

    public Category: EventCategory;
}