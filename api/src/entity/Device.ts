import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Device {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public os: string;

    @Column()
    public software: string;

    @Column()
    public device: string;

    @Column()
    public token: string;

    @ManyToOne(() => User, (user) => user.devices)
    public user: User;
}
