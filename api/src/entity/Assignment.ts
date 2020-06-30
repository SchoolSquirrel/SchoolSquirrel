import {
Column,
Entity,
PrimaryGeneratedColumn,
ManyToOne,
} from "typeorm";
import { Course } from "./Course";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({length: 10000})
  public content: string;

  @ManyToOne(() => Course, (course) => course.assignments)
  public course: Course;
}
