import {
Column,
Entity,
PrimaryGeneratedColumn,
OneToMany,
ManyToMany,
JoinTable,
} from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: true})
  public name: string;

  @OneToMany(() => Message, (message) => message.chat)
  public messages: Message[];

  @JoinTable()
  @ManyToMany(() => User, (user) => user.chats)
  public users: User[];

  public info?: string;
}
