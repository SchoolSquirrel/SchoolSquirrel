import {
    Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

export enum ActivityType {
    CHAT_MESSAGE = "CHAT_MESSAGE",
    COURSE_MESSAGE = "COURSE_MESSAGE",
    ASSIGNMENT_CREATED = "ASSIGNMENT_CREATED",
    ASSIGNMENT_RETURNED = "ASSIGNMENT_RETURNED",
    ASSIGNMENT_SUBMITTED = "ASSIGNMENT_SUBMITTED",
    FILE_UPLOADED = "FILE_UPLOADED",
    EVENT_CREATED = "EVENT_CREATED",
    CONFERENCE_STARTED = "CONFERENCE_STARTED",
    INCOMING_CALL = "INCOMING_CALL",
    MISSED_CALL = "MISSED_CALL",
}

export const ActivitySettings: {
    [k in ActivityType]: {
        persistent: boolean;
        pushNotification: boolean;
    };
} = {
    ASSIGNMENT_CREATED: {
        persistent: true,
        pushNotification: false,
    },
    ASSIGNMENT_RETURNED: {
        persistent: true,
        pushNotification: false,
    },
    ASSIGNMENT_SUBMITTED: {
        persistent: true,
        pushNotification: false,
    },
    CHAT_MESSAGE: {
        persistent: true,
        pushNotification: true,
    },
    COURSE_MESSAGE: {
        persistent: true,
        pushNotification: true,
    },
    CONFERENCE_STARTED: {
        persistent: false,
        pushNotification: true,
    },
    EVENT_CREATED: {
        persistent: true,
        pushNotification: false,
    },
    FILE_UPLOADED: {
        persistent: true,
        pushNotification: false,
    },
    INCOMING_CALL: {
        persistent: false,
        pushNotification: true,
    },
    MISSED_CALL: {
        persistent: true,
        pushNotification: true,
    },
};

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    itemId: string;

    @Column()
    type: ActivityType;

    @ManyToMany(() => User, (user) => user.activities)
    @JoinTable()
    users: User[];

    @Column()
    @CreateDateColumn()
    date: Date;

    persistent: boolean;
    pushNotification: boolean;
    payload: any;
}
