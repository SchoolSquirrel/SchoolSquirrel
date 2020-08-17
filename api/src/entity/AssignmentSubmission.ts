import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Assignment } from "./Assignment";

@Entity()
export class AssignmentSubmission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "text" })
  public message: string;

  @Column()
  public date: Date;

  @Column({ nullable: true })
  public returned: Date;

  @Column({ type: "text" })
  public feedback: string;

  @ManyToOne(() => User, (user) => user.submittedAssignments)
  public user: User;

  @ManyToOne(() => Assignment, (assignment) => assignment.userSubmissions)
  public assignment: Assignment;

  public files: any[];
}
