import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
} from "typeorm";
import { Course } from "./Course";
import { User } from "./User";
import { AssignmentSubmission } from "./AssignmentSubmission";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ length: 10000 })
  public content: string;

  @Column()
  public due: Date;

  @ManyToOne(() => Course, (course) => course.assignments)
  public course: Course;

  @OneToOne(() => User, (user) => user.assignmentDraft)
  public draftUser: User;

  @OneToMany(() => AssignmentSubmission, (assignmentSubmission) => assignmentSubmission.assignment)
  public userSubmissions: AssignmentSubmission[];

  public submissionsMissing?: User[];

  public materials?: any[];
  public worksheets?: any[];
  public submissions?: any[];

  public submitted?: Date;
}
