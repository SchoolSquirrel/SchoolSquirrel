import * as bcrypt from "bcryptjs";
import {
Column,
CreateDateColumn,
Entity,
PrimaryGeneratedColumn,
Unique,
UpdateDateColumn,
OneToMany,
} from "typeorm";
import { User } from "./User";
import { Assignment } from "./Assignment";

@Entity()
@Unique(["name"])
export class Grade {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => User, (user) => user.grade)
  public users: User[];

  @OneToMany(() => Assignment, (assignment) => assignment.grade)
  public assignments: Assignment[];
}
