import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import * as minio from "minio";
import { Assignment } from "../entity/Assignment";
import { Course } from "../entity/Course";
import { sanitizeHtml } from "../utils/html";
import { User } from "../entity/User";
import { listObjects } from "../utils/storage";
import { Buckets } from "../entity/Buckets";
import { isAdmin } from "../utils/roles";

class AssignmentsController {
    public static async listCoursesWithAssignments(req: Request, res: Response): Promise<void> {
        const courseRepository = getRepository(Course);
        let assignments: Course[];
        if (await isAdmin(res.locals.jwtPayload.userId)) {
            assignments = await courseRepository
                .createQueryBuilder("course")
                .leftJoinAndSelect("course.assignments", "assignment")
                .getMany();
        } else {
            assignments = await courseRepository
                .createQueryBuilder("course")
                .leftJoinAndSelect("course.assignments", "assignment")
                .leftJoin("course.students", "user")
                .where("user.id = :id", { id: res.locals.jwtPayload.userId })
                .getMany();
        }
        res.send(assignments);
    }

    public static async getAssignment(req: Request, res: Response): Promise<void> {
        const assignmentRepository = getRepository(Assignment);
        const assignment = await assignmentRepository.findOne(req.params.id);
        await AssignmentsController.addFilesToAssignment(assignment, req);
        res.send(assignment);
    }

    public static async downloadFile(req: Request, res: Response): Promise<void> {
        const path = AssignmentsController.getAssignmentFilePath(req);
        (req.app.locals.minio as minio.Client)
            .getObject(Buckets.ASSIGNMENTS, path).then(async (s) => {
                s.pipe(res);
            }, (e) => {
                res.status(500).send({ message: e });
            });
    }

    public static async getAssignmentDraft(req: Request, res: Response): Promise<void> {
        const me = await getRepository(User).findOne(res.locals.jwtPayload.userId);
        const assignment = await AssignmentsController.createDraftIfNotExisting(res, me);
        await AssignmentsController.addFilesToAssignment(assignment, req);
        res.status(200).send(assignment);
    }

    public static async saveAssignmentDraft(req: Request, res: Response): Promise<void> {
        const assignment = await AssignmentsController
            .findAssignmentDraft(res.locals.jwtPayload.userId);
        if (!assignment) {
            const me = await getRepository(User).findOne(res.locals.jwtPayload.userId);
            await AssignmentsController.createDraftIfNotExisting(res, me);
            res.status(200).send({ success: true });
            return;
        }
        assignment.title = req.body.title || "";
        assignment.content = sanitizeHtml(req.body.content || "");
        assignment.due = req.body.due;

        const assignmentRepository = getRepository(Assignment);

        try {
            await assignmentRepository.save(assignment);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async newAssignment(req: Request, res: Response): Promise<void> {
        const {
            title, content, course, due,
        } = req.body;
        if (!(title && content && course && due)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const assignment = await AssignmentsController
            .findAssignmentDraft(res.locals.jwtPayload.userId);
        assignment.title = title;
        assignment.content = sanitizeHtml(content);
        assignment.due = due;
        assignment.course = await getRepository(Course).findOne(course);
        assignment.draftUser = null;

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
    public static async deleteAssignment(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const assignmentRepository = getRepository(Assignment);
        try {
            await assignmentRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingAssignment") });
            return;
        }

        res.status(200).send({ success: true });
    }

    private static getAssignmentFilePath(req): string {
        return `${req.params.id}/${req.params.type == "materials" ? "materials" : "worksheets"}/${req.params.file}`;
    }

    private static async addFilesToAssignment(assignment: Assignment, req): Promise<void> {
        assignment.worksheets = await listObjects(req.app.locals.minio, Buckets.ASSIGNMENTS, `${assignment.id}/worksheets/`);
        assignment.materials = await listObjects(req.app.locals.minio, Buckets.ASSIGNMENTS, `${assignment.id}/materials/`);
    }

    private static async createDraftIfNotExisting(res: Response, me: User): Promise<Assignment> {
        let assignment = await AssignmentsController
            .findAssignmentDraft(res.locals.jwtPayload.userId);
        if (!assignment) {
            assignment = new Assignment();
            assignment.title = "";
            assignment.content = "";
            assignment.draftUser = me;
            const d = new Date();
            d.setDate(new Date().getDate() + 1);
            d.setHours(23);
            d.setMinutes(59);
            assignment.due = d;
            assignment = await getRepository(Assignment).save(assignment);
        }
        return assignment;
    }

    private static async findAssignmentDraft(id: number): Promise<Assignment> {
        return getRepository(Assignment).createQueryBuilder("assignment")
            .leftJoinAndSelect("assignment.draftUser", "user")
            .where("user.id = :id", { id })
            .getOne();
    }
}

export default AssignmentsController;
