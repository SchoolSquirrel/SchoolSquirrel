import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { Assignment } from "./Assignment";
import { Message } from "./Message";

@Entity()
export class Course {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @JoinTable()
    @ManyToMany(() => User, (user) => user.courses)
    public students: User[];

    @JoinTable()
    @ManyToMany(() => User, (user) => user.coursesTeaching)
    public teachers: User[];

    @OneToMany(() => Assignment, (assignment) => assignment.course)
    public assignments: Assignment[];

    @OneToMany(() => Message, (message) => message.course)
    public messages: Message[];
}
