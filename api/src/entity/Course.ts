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

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @JoinTable()
    @ManyToMany(() => User, (user) => user.courses)
    public students: User[];

    @JoinTable()
    @ManyToMany(() => User, (user) => user.coursesTeaching)
    public teachers: User[];

    @OneToMany(() => Assignment, (assignment) => assignment.course)
    public assignments: Assignment[];
}
