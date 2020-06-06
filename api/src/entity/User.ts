import * as bcrypt from "bcryptjs";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
} from "typeorm";
import { Grade } from "./Grade";
import { Course } from "./Course";

@Entity()
@Unique(["username"])
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public username: string;

    @Column()
    public role: "student" | "teacher" | "admin";

    @Column({ select: false })
    public password: string;

    @Column({ select: false, nullable: true })
    public passwordResetToken: string;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(() => Grade, (grade) => grade.users)
    public grade: Grade;

    @ManyToMany(() => Course, (course) => course.users)
    public courses: Course[];

    public jwtToken?: string;

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        if (unencryptedPassword) {
            return bcrypt.compareSync(unencryptedPassword, this.password);
        } else {
            return false;
        }
    }
}
