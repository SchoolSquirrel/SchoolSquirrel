import * as bcrypt from "bcryptjs";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    OneToMany,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Grade } from "./Grade";
import { Course } from "./Course";
import { Chat } from "./Chat";
import { Message } from "./Message";
import { Event } from "./Event";
import { Assignment } from "./Assignment";
import { AssignmentSubmission } from "./AssignmentSubmission";
import { Device } from "./Device";
import { Conference } from "./Conference";
import { Activity } from "./Activity";

@Entity()
@Unique(["name"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column()
    public role: "student" | "teacher" | "admin";

    @Column({ select: false })
    public password: string;

    @Column({ select: false, nullable: true })
    public passwordResetToken: string;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(() => Grade, (grade) => grade.users)
    public grade: Grade;

    @ManyToMany(() => Course, (course) => course.students)
    public courses: Course[];

    @ManyToMany(() => Course, (course) => course.teachers)
    public coursesTeaching: Course[];

    @ManyToMany(() => Chat, (chat) => chat.users)
    public chats: Chat[];

    @ManyToMany(() => Activity, (activity) => activity.users)
    public activities: Activity[];

    @ManyToMany(() => Conference, (conference) => conference.users)
    public conferences: Conference[];

    @OneToMany(() => Message, (message) => message.sender)
    public messages: Message[];

    @OneToMany(() => Event, (event) => event.user)
    public events: Event[];

    @OneToMany(() => AssignmentSubmission, (assignmentSubmission) => assignmentSubmission.user)
    public submittedAssignments: AssignmentSubmission[];

    @OneToMany(() => Device, (device) => device.user)
    public devices: Device[];

    @OneToOne(() => Assignment, (assignment) => assignment.draftUser)
    @JoinColumn()
    public assignmentDraft: Assignment;

    public jwtToken?: string;

    public hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
        if (unencryptedPassword) {
            return bcrypt.compareSync(unencryptedPassword, this.password);
        }
        return false;
    }
}
