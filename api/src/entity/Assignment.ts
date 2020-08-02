import {
Column,
Entity,
PrimaryGeneratedColumn,
ManyToOne,
OneToOne,
} from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({length: 10000})
  public content: string;

  @Column()
  public due: Date;

  @ManyToOne(() => Course, (course) => course.assignments)
  public course: Course;

  @OneToOne(() => User, (user) => user.assignmentDraft)
  public draftUser: User;

  public materials: any[];
  public worksheets: any[];
}
