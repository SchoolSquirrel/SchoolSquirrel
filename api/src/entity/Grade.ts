import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    OneToMany,
} from "typeorm";
import { User } from "./User";

@Entity()
@Unique(["name"])
export class Grade {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @OneToMany(() => User, (user) => user.grade)
  public users: User[];
}
