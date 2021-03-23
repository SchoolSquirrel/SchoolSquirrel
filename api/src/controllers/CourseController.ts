import { Request } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import * as v from "validator";
import { Course } from "../entity/Course";
import { User } from "../entity/User";
import { sendMessage } from "../utils/messages";
import { isAdmin } from "../utils/roles";
import AssignmentsController from "./AssignmentsController";
import { IResponse } from "../interfaces/IExpress";

class CourseController {
    public static async listAll(req: Request, res: IResponse): Promise<void> {
        const courseRepository = getRepository(Course);
        let courses: Course[];
        if (await isAdmin(res.locals.jwtPayload.userId)) {
            courses = await courseRepository.find();
        } else {
            courses = await courseRepository
                .createQueryBuilder("course")
                .leftJoin("course.students", "user")
                .where("user.id = :id", { id: res.locals.jwtPayload.userId })
                .getMany();
        }
        res.send(courses);
    }

    public static async getCourse(req: Request, res: IResponse): Promise<void> {
        const courseRepository = getRepository(Course);
        const { id } = req.params;
        if (!v.isUUID(id)) {
            res.status(404).send({ message: "Kurs nicht gefunden!" });
            return;
        }
        try {
            const course = await courseRepository.findOneOrFail(id, { relations: ["students", "teachers", "messages", "messages.sender", "assignments"] });
            for (const assignment of course.assignments) {
                await AssignmentsController.checkIfSubmitted(
                    res, assignment, res.locals.jwtPayload.user,
                );
            }
            res.send(course);
        } catch {
            res.status(404).send({ message: "Course not found!" });
        }
    }

    public static async sendMessage(req: Request, res: IResponse): Promise<void> {
        sendMessage(req, res, "course");
    }

    public static async newCourse(req: Request, res: IResponse): Promise<void> {
        const { name, users, description }:
            { name: string, users: number[], description: string } = req.body;
        if (!(name && users && users.length)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const courseRepository = getRepository(Course);
        const userRepository = getRepository(User);
        const course = new Course();
        course.name = name;
        course.description = description;
        course.students = [];
        course.teachers = [];
        try {
            for (const user of users) {
                course.students.push(await userRepository.findOneOrFail(user));
            }
        } catch {
            res.status(404).send({ message: "User not found!" });
            return;
        }
        course.teachers.push(res.locals.jwtPayload.user);
        try {
            await courseRepository.save(course);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingCoursename") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async editCourse(req: Request, res: IResponse): Promise<void> {
        const { name, users, description }:
            { name: string, users: number[], description: string } = req.body;
        if (!(name && users && users.length)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const courseRepository = getRepository(Course);
        const userRepository = getRepository(User);
        let course: Course;
        try {
            course = await courseRepository.findOneOrFail(req.params.id, { relations: ["students", "teachers"] });
        } catch {
            res.status(404).send({ message: "Course not found!" });
            return;
        }
        course.name = name;
        course.description = description;
        course.students = [];
        course.teachers = [];
        try {
            for (const user of users) {
                course.students.push(await userRepository.findOneOrFail(user));
            }
        } catch {
            res.status(404).send({ message: "User not found!" });
            return;
        }
        course.teachers.push(res.locals.jwtPayload.user);
        try {
            await courseRepository.save(course);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingCoursename") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async deleteCourse(req: Request, res: IResponse): Promise<void> {
        const { id } = req.params;
        const courseRepository = getRepository(Course);
        try {
            await courseRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingCourse") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default CourseController;
