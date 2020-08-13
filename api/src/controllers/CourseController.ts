import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Course } from "../entity/Course";
import { User } from "../entity/User";
import { sendMessage } from "../utils/messages";
import { isAdmin } from "../utils/roles";

class CourseController {
    public static async listAll(req: Request, res: Response): Promise<void> {
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

    public static async getCourse(req: Request, res: Response): Promise<void> {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne(req.params.id, { relations: ["students", "teachers", "messages", "messages.sender", "assignments"] });
        res.send(course);
    }

    public static async sendMessage(req: Request, res: Response): Promise<void> {
        sendMessage(req, res, "course");
    }

    public static async newCourse(req: Request, res: Response): Promise<void> {
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
        for (const user of users) {
            course.students.push(await userRepository.findOne(user));
        }
        course.teachers.push(await userRepository.findOne(res.locals.jwtPayload.userId));
        try {
            await courseRepository.save(course);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingCoursename") });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static async deleteCourse(req: Request, res: Response): Promise<void> {
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
