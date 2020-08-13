import { getRepository } from "typeorm";
import { User } from "../entity/User";

function getUser(userId: number): Promise<User> {
    const userRepository = getRepository(User);
    try {
        return userRepository.findOneOrFail(userId);
    } catch {
        return undefined;
    }
}

export async function isAdmin(userId: number): Promise<boolean> {
    const user = await getUser(userId);
    return user && user.role == "admin";
}

export async function isTeacher(userId: number): Promise<boolean> {
    const user = await getUser(userId);
    return user && (user.role == "admin" || user.role == "teacher");
}
