import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import * as minio from "minio";
import { Assignment } from "../entity/Assignment";
import { Course } from "../entity/Course";
import { sanitizeHtml } from "../utils/html";
import * as multer from "multer";

class AssignmentsController {
    public static listCoursesWithAssignments = async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const assignments = await courseRepository
            .createQueryBuilder("course")
            .leftJoinAndSelect("course.assignments", "assignment")
            .leftJoin("course.students", "user")
            .where("user.id = :id", { id: res.locals.jwtPayload.userId })
            .getMany();
        res.send(assignments);
    }

    public static getAssignment = async (req: Request, res: Response) => {
        const assignmentRepository = getRepository(Assignment);
        const assignment = await assignmentRepository.findOne(req.params.id);
        res.send(assignment);
    }

    public static uploadFile = async (req: Request, res: Response) => {
        (req.app.locals.minio as minio.Client).putObject("assignments", req.file.originalname, req.file.buffer).then((etag) => {
            res.send({etag});
        }, (e) => {
            res.status(500).send({ message: e });
        });
    }

    public static newAssignment = async (req: Request, res: Response) => {
        const { title, content, course, due } = req.body;
        if (!(title && content && course && due)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const assignment = new Assignment();
        assignment.title = title;
        assignment.content = sanitizeHtml(content);
        assignment.due = due;
        assignment.course = await getRepository(Course).findOne(course);

        const assignmentRepository = getRepository(Assignment);

        try {
            await assignmentRepository.save(assignment);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.status(200).send({ success: true });
    }

    /*
    public static editAssignment = async (req: Request, res: Response) => {
        const id = req.params.id;

        const { name, role, grade } = req.body;

        const assignmentRepository = getRepository(Assignment);
        const gradeRepository = getRepository(Grade);
        let assignment;
        try {
            assignment = await assignmentRepository.findOne(id);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.assignmentNotFound") });
            return;
            return;
        }

        if (!(name && role && grade)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        assignment.assignmentname = name;
        assignment.role = role;
        assignment.grade = await gradeRepository.findOne(grade);

        try {
            await assignmentRepository.save(assignment);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingAssignmentname") });
            return;
        }

        res.status(200).send({ success: true });
    }
*/
    public static deleteAssignment = async (req: Request, res: Response) => {

        const id = req.params.id;

        const assignmentRepository = getRepository(Assignment);
        try {
            await assignmentRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingAssignment") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default AssignmentsController;
