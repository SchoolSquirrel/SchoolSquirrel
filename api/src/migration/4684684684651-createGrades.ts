import { getRepository, MigrationInterface } from "typeorm";
import { Grade } from "../entity/Grade";

export class createGrades4684684684651 implements MigrationInterface {
    public async up(): Promise<any> {
        const grade1 = new Grade();
        grade1.name = "Lehrer";
        const grade2 = new Grade();
        grade2.name = "Studienreferendar";
        const gradeRepository = getRepository(Grade);
        await gradeRepository.save([grade1, grade2]);
    }

    public async down(): Promise<any> {
        //
    }
}
