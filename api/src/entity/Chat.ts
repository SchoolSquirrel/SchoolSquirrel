import {
Column,
Entity,
PrimaryGeneratedColumn,
OneToMany,
ManyToMany,
JoinTable,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.chats)
  public users: User[];

  public info?: string;
}
