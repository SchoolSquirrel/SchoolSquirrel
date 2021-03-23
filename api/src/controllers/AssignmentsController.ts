import { Request } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import * as v from "validator";
import { Assignment } from "../entity/Assignment";
import { Course } from "../entity/Course";
import { sanitizeHtml } from "../utils/html";
import { User } from "../entity/User";
import { listObjects } from "../utils/storage";
import { Buckets } from "../entity/Buckets";
import { isAdmin, isTeacher } from "../utils/roles";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { IResponse } from "../interfaces/IExpress";

class AssignmentsController {
    /**
     * @apiDescription List all assingments
     * @apiResponse 200 | OK | Course[]
     */
    public static async listCoursesWithAssignments(req: Request, res: IResponse): Promise<void> {
        const courseRepository = getRepository(Course);
        let courses: Course[];
        if (await isAdmin(res.locals.jwtPayload.userId)) {
            courses = await courseRepository
                .createQueryBuilder("course")
                .leftJoinAndSelect("course.assignments", "assignment")
                .getMany();
        } else {
            courses = await courseRepository
                .createQueryBuilder("course")
                .leftJoinAndSelect("course.assignments", "assignment")
                .leftJoin("course.students", "user")
                .where("user.id = :id", { id: res.locals.jwtPayload.userId })
                .getMany();
        }
        for (const course of courses) {
            for (const assignment of course.assignments) {
                await AssignmentsController.checkIfSubmitted(
                    res, assignment, res.locals.jwtPayload.user,
                );
            }
        }
        res.send(courses);
    }

    /**
     * @apiDescription Get an assingment
     * @apiResponse 200 | OK | Assignment
     * @apiResponse 404 | Not Found | Error
     */
    public static async getAssignment(req: Request, res: IResponse): Promise<void> {
        const assignmentRepository = getRepository(Assignment);
        const teacher = await isTeacher(res.locals.jwtPayload.userId);
        try {
            const { id } = req.params;
            if (!v.isUUID(id)) {
                res.status(404).send({ message: "Aufgabe nicht gefunden!" });
                return;
            }
            const assignment = await assignmentRepository.findOneOrFail(id,
                teacher ? { relations: ["course", "course.students", "userSubmissions", "userSubmissions.user"] } : {});
            await AssignmentsController.addFilesToAssignment(assignment, req, res);
            await AssignmentsController.checkIfSubmitted(res, assignment);
            if (teacher) {
                assignment.submissionsMissing = [];
                for (const user of assignment.course.students) {
                    if (!assignment.userSubmissions.find((s) => s.user.id == user.id)) {
                        assignment.submissionsMissing.push(user);
                    }
                }
                const allSubmissions = await listObjects(req.app.locals.minio, Buckets.ASSIGNMENTS, `${assignment.id}/submissions/`, true);
                for (const submission of assignment.userSubmissions) {
                    submission.files = allSubmissions.filter((s) => s.name?.startsWith(`${assignment.id}/submissions/${submission.user.id}/`));
                }
            }
            res.send(assignment);
        } catch {
            res.status(404).send({ message: "Aufgabe nicht gefunden!" });
        }
    }

    public static async checkIfSubmitted(res: IResponse,
        assignment: Assignment, user?: User): Promise<void> {
        const assignmentSubmission = await getRepository(AssignmentSubmission).findOne({
            where: {
                user: user || res.locals.jwtPayload.user,
                assignment,
            },
        });
        assignment.submitted = assignmentSubmission?.date || undefined;
        assignment.returned = assignmentSubmission?.returned || undefined;
        assignment.feedback = assignmentSubmission?.feedback || "";
    }

    /**
     * @apiDescription Get the current assingment draft or create one
     * @apiResponse 200 | OK | Assignment
     */
    public static async getAssignmentDraft(req: Request, res: IResponse): Promise<void> {
        const assignment = await AssignmentsController.createDraftIfNotExisting(
            res, res.locals.jwtPayload.user,
        );
        await AssignmentsController.addFilesToAssignment(assignment, req, res);
        res.status(200).send(assignment);
    }

    /**
     * @apiDescription Save assingment draft
     * @apiBodyParameter title | string | false | The assignment title
     * @apiBodyParameter content | string | false | The assignment content
     * @apiBodyParameter due | date | false | The assignment due date
     * @apiResponse 200 | OK | Success
     * @apiResponse 404 | Not Found | Error
     * @apiResponse 500 | Server Error | Error
     */
    public static async saveAssignmentDraft(req: Request, res: IResponse): Promise<void> {
        const assignment = await AssignmentsController
            .findAssignmentDraft(res.locals.jwtPayload.userId);
        if (!assignment) {
            await AssignmentsController.createDraftIfNotExisting(res, res.locals.jwtPayload.user);
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

    /**
     * @apiDescription Submit an assignment
     * @apiBodyParameter message | string | false | An optional message for the teacher
     * @apiResponse 200 | OK | Success
     * @apiResponse 404 | Not Found | Error
     * @apiResponse 500 | Server Error | Error
     */
    public static async submitAssignment(req: Request, res: IResponse): Promise<void> {
        let assignment: Assignment;
        try {
            assignment = await getRepository(Assignment).findOneOrFail(req.params.id);
        } catch {
            res.status(404).send({ message: "Assignment not found!" });
            return;
        }
        await AssignmentsController.checkIfSubmitted(res, assignment, res.locals.jwtPayload.user);
        if (assignment.submitted) {
            res.send({ success: true });
            return;
        }
        const assignmentSubmission = new AssignmentSubmission();
        assignmentSubmission.message = req.body.message || "";
        assignmentSubmission.user = res.locals.jwtPayload.user;
        assignmentSubmission.assignment = assignment;
        assignmentSubmission.date = new Date();
        try {
            await getRepository(AssignmentSubmission).save(assignmentSubmission);
            res.send({ success: true });
        } catch {
            res.status(500).send({ message: "Error" });
        }
    }

    /**
     * @apiDescription Unsubmit an assignment
     * @apiResponse 200 | OK | Success
     * @apiResponse 404 | Not Found | Error
     * @apiResponse 500 | Server Error | Error
     */
    public static async unsubmitAssignment(req: Request, res: IResponse): Promise<void> {
        let assignment: Assignment;
        try {
            assignment = await getRepository(Assignment).findOneOrFail(req.params.id);
        } catch {
            res.status(404).send({ message: "Assignment not found!" });
            return;
        }
        await AssignmentsController.checkIfSubmitted(res, assignment, res.locals.jwtPayload.user);
        if (!assignment.submitted) {
            res.send({ success: true });
            return;
        }
        try {
            await getRepository(AssignmentSubmission).delete({
                assignment,
                user: res.locals.jwtPayload.user,
            });
            res.send({ success: true });
        } catch {
            res.status(500).send({ message: "Error" });
        }
    }

    /**
     * @apiDescription Return an assignment
     * @apiBodyParameter feddback | string | false | An optional feedback for the student
     * @apiResponse 200 | OK | Success
     * @apiResponse 404 | Not Found | Error
     */
    public static async returnAssignment(req: Request, res: IResponse): Promise<void> {
        let user: User;
        try {
            user = await getRepository(User).findOneOrFail(req.params.userId);
        } catch {
            res.status(404).send({ message: "User not found!" });
            return;
        }
        let assignment: Assignment;
        try {
            assignment = await getRepository(Assignment).findOneOrFail(req.params.id);
        } catch {
            res.status(404).send({ message: "Assignment not found!" });
            return;
        }
        const assignmentSubmissionRepository = getRepository(AssignmentSubmission);
        try {
            const assignmentSubmission = await assignmentSubmissionRepository.findOneOrFail({
                assignment, user,
            });
            assignmentSubmission.feedback = req.body.feedback || "";
            assignmentSubmission.returned = new Date();
            await assignmentSubmissionRepository.save(assignmentSubmission);
            res.send({ success: true });
        } catch {
            res.status(404).send({ message: "Submission not found" });
        }
    }

    /**
     * @apiDescription Create a new assingment
     * @apiBodyParameter title | string | true | The assignment title
     * @apiBodyParameter content | string | true | The assignment content
     * @apiBodyParameter due | date | true | The assignment due date
     * @apiBodyParameter course | number | true | The id of the course for the assignment
     * @apiResponse 200 | OK | Success
     * @apiResponse 500 | Server Error | Error
     */
    public static async newAssignment(req: Request, res: IResponse): Promise<void> {
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
        try {
            assignment.course = await getRepository(Course).findOneOrFail(course);
        } catch {
            res.status(404).send({ message: "Course not found" });
            return;
        }
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
    public static editAssignment = async (req: Request, res: IResponse) => {
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
    /**
     * @apiDescription Delete an assignment
     * @apiResponse 200 | OK | Success
     * @apiResponse 500 | Server Error | Error
     */
    public static async deleteAssignment(req: Request, res: IResponse): Promise<void> {
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

    private static async addFilesToAssignment(assignment: Assignment,
        req: Request, res: IResponse): Promise<void> {
        assignment.worksheets = await listObjects(req.app.locals.minio, Buckets.ASSIGNMENTS, `${assignment.id}/worksheets/`);
        assignment.materials = await listObjects(req.app.locals.minio, Buckets.ASSIGNMENTS, `${assignment.id}/materials/`);
        if (!await isTeacher(res.locals.jwtPayload.userId)) {
            assignment.submissions = await listObjects(req.app.locals.minio, Buckets.ASSIGNMENTS, `${assignment.id}/submissions/${res.locals.jwtPayload.userId}/`);
            for (const worksheet of assignment.worksheets) {
                if (assignment.submissions.find((s) => s.name.split(".").pop() == worksheet.name.split(".").pop())) {
                    worksheet.worksheetHasAlreadyBeenEdited = true;
                }
            }
        }
    }

    private static async createDraftIfNotExisting(res: IResponse, me: User): Promise<Assignment> {
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

    private static async findAssignmentDraft(id: string): Promise<Assignment> {
        return getRepository(Assignment).createQueryBuilder("assignment")
            .leftJoinAndSelect("assignment.draftUser", "user")
            .where("user.id = :id", { id })
            .getOne();
    }
}

export default AssignmentsController;
