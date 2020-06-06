import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @JoinTable()
    @ManyToMany(() => User, (user) => user.courses)
    public users: User[];
}
