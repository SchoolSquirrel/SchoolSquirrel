import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import { Grade } from "../entity/Grade";

// tslint:disable-next-line: class-name
export class createGrades4684684684651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const grade1 = new Grade();
        grade1.name = "Lehrer";
        const grade2 = new Grade();
        grade2.name = "Studienreferendar";
        const gradeRepository = getRepository(Grade);
        await gradeRepository.save([grade1, grade2]);
    }

    // tslint:disable-next-line: no-empty
    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
