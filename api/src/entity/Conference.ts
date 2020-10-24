import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Conference {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    @CreateDateColumn()
    public created: Date;

    @Column()
    public started: Date;

    @Column()
    public type: "private" | "group" | "course";

    @JoinTable()
    @ManyToMany(() => User, (user) => user.conferences)
    public users: User[];
}
