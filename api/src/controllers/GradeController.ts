import { Request } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Grade } from "../entity/Grade";
import { IResponse } from "../interfaces/IExpress";

class GradeController {
    public static async listAll(req: Request, res: IResponse): Promise<void> {
        const gradeRepository = getRepository(Grade);
        const grades = await gradeRepository.find({ relations: ["users"] });
        res.send(grades);
    }

    public static async newGrade(req: Request, res: IResponse): Promise<void> {
        const { name } = req.body;
        if (!name) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const grade = new Grade();
        grade.name = name;
        const gradeRepository = getRepository(Grade);
        try {
            await gradeRepository.save(grade);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingGradename") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async deleteGrade(req: Request, res: IResponse): Promise<void> {
        const { id } = req.params;
        const gradeRepository = getRepository(Grade);
        try {
            await gradeRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingGrade") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default GradeController;
