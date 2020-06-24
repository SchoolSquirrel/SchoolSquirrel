import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Course } from "../entity/Course";
import { User } from "../entity/User";
class CourseController {
    public static listAll = async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const courses = await courseRepository.find({ relations: ["students", "teachers"]});
        res.send(courses);
    }

    public static getCourse = async (req: Request, res: Response) => {
        const courseRepository = getRepository(Course);
        const course = await courseRepository.findOne(req.params.id, { relations: ["students", "teachers"]});
        res.send(course);
    }

    public static newCourse = async (req: Request, res: Response) => {
        const { name, users }: {name: string, users: number[]} = req.body;
        if (!(name && users && users.length)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const courseRepository = getRepository(Course);
        const userRepository = getRepository(User);
        const course = new Course();
        course.name = name;
        course.students = [];
        course.teachers = [];
        for (const user of users) {
            course.students.push(await userRepository.findOne(user))
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

    public static deleteCourse = async (req: Request, res: Response) => {
        const id = req.params.id;
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
