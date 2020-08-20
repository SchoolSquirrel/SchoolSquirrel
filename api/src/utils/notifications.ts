import axios from "axios";
import { getRepository } from "typeorm";
import { NotificationCategory } from "../entity/NotificationCategory";
import { User } from "../entity/User";
import { Device } from "../entity/Device";

type Notification = {
    title: string,
    body: string,
}

const relayServerUrl = "https://push-notifications.schoolsquirrel.hannesrueger.de";
const invalidTokenErrorCodes = ["messaging/invalid-argument", "messaging/registration-token-not-registered"];

export async function sendPushNotification(
    user: User, notification: Notification, data: {
        silent?: boolean,
        type: NotificationCategory,
        [key: string]: any,
    },
): Promise<void> {
    if (!user.devices) {
        user.devices = await getRepository(Device).find({ where: { user } });
    }
    for (const device of user.devices) {
        axios.post(relayServerUrl, {
            token: device.token,
            notification,
            data,
        }).then((s) => {
            if (s.status == 200) {
                // console.log("resolve", s.data);
            }
        }, async (e) => {
            if (invalidTokenErrorCodes.includes(e.response.data?.code)) {
                // the token does not exist anymore, remove from db
                await getRepository(Device).delete({ token: device.token });
            } else {
                // eslint-disable-next-line no-console
                console.log("Unknown error", e);
            }
        });
    }
}
