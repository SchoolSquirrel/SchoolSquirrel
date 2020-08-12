import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from "typeorm";
import { SchedulerEvent } from "./SchedulerEvent";
import { User } from "./User";
import { EventCategory } from "./EventCategory";

@Entity()
export class Event implements SchedulerEvent {
    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public Subject: string;

    @Column({ nullable: true })
    public Description: string;

    @Column({ nullable: true })
    public Location: string;

    @Column()
    public StartTime: Date;

    @Column()
    public EndTime: Date;

    @Column({ default: false })
    public IsAllDay: boolean;

    @Column({ nullable: true })
    public StartTimezone: string;

    @Column({ nullable: true })
    public EndTimezone: string;

    @Column({ nullable: true })
    public RecurrenceRule: string;

    @ManyToOne(() => User, (user) => user.events)
    public user: User;

    public Category: EventCategory;
}
