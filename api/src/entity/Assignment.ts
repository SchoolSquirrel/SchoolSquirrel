import {
Column,
Entity,
PrimaryGeneratedColumn,
ManyToOne,
} from "typeorm";
import { Grade } from "./Grade";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({length: 10000})
  public content: string;

  @ManyToOne(() => Grade, (grade) => grade.assignments)
  public grade: Grade;
}
