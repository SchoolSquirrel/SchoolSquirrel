import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as i18n from "i18n";
import { Device } from "../entity/Device";
import { User } from "../entity/User";

class DeviceController {
    public static async listAll(req: Request, res: Response): Promise<void> {
        const deviceRepository = getRepository(Device);
        const devices = await deviceRepository.find({
            where: {
                user: await getRepository(User).findOne(res.locals.jwtPayload.userId),
            },
        });
        res.send(devices);
    }

    public static async newDevice(req: Request, res: Response): Promise<void> {
        const {
            os, token, software, device,
        } = req.body;
        if (!(os && token && software && device)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }
        const deviceRepository = getRepository(Device);
        if (await deviceRepository.findOne({ token })) {
            res.send({ success: true });
            return;
        }

        const d = new Device();
        d.device = device;
        d.software = software;
        d.token = token;
        d.os = os;
        const userRepository = getRepository(User);
        d.user = await userRepository.findOne(res.locals.jwtPayload.userId);
        try {
            await deviceRepository.save(d);
        } catch {
            res.status(400).send({ message: i18n.__("errors.unknown") });
            return;
        }
        res.send({ success: true });
    }

    public static async deleteDevice(req: Request, res: Response): Promise<void> {
        const { token } = req.params;
        const deviceRepository = getRepository(Device);
        try {
            await deviceRepository.delete({ token });
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingDevice") });
            return;
        }
        res.status(200).send({ success: true });
    }
}

export default DeviceController;
