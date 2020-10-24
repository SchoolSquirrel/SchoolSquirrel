import axios from "axios";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Device } from "../entity/Device";
import { ActivityType } from "../entity/Activity";

export type PushNotification = {
    title: string,
    body: string,
}
export type PushNotificationData = {
    silent?: boolean,
    subtitle?: string,
    color?: string,
    image?: string,
    thumbnail?: string,
    channel?: string,
    type: ActivityType,
    [key: string]: any,
};

const relayServerUrl = "https://push-notifications.schoolsquirrel.hannesrueger.de";
const invalidTokenErrorCodes = ["messaging/invalid-argument", "messaging/registration-token-not-registered"];

export async function sendPushNotification(
    user: User, notification: PushNotification, data: PushNotificationData,
): Promise<void> {
    if (!user.devices) {
        user.devices = await getRepository(Device).find({ where: { user } });
    }
    for (const device of user.devices) {
        console.log("sending to ", device);
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
