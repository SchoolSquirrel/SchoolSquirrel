import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Grade } from "../entity/Grade";
class GradeController {
    public static listAll = async (req: Request, res: Response) => {
        const gradeRepository = getRepository(Grade);
        const grades = await gradeRepository.find({ relations: ["users"]});
        res.send(grades);
    }

    public static newGrade = async (req: Request, res: Response) => {
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

    public static deleteGrade = async (req: Request, res: Response) => {
        const id = req.params.id;
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
