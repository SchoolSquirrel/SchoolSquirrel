import axios from "axios";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Device } from "../entity/Device";
import { Activity } from "../entity/Activity";
import { PushNotificationInfo, PushNotificationData } from "../entity/PushNotification";

const relayServerUrl = "https://push-notifications.schoolsquirrel.dev.hannesrueger.de";
const invalidTokenErrorCodes = ["messaging/invalid-argument", "messaging/registration-token-not-registered"];

export async function sendPushNotification(
    user: User, activity: Activity, notification: PushNotificationInfo, data: PushNotificationData,
): Promise<void> {
    if (!user.devices) {
        user.devices = await getRepository(Device).find({ where: { user } });
    }
    for (const device of user.devices) {
        axios.post(relayServerUrl, {
            token: device.token,
            notification,
            data: { ...data, payload: JSON.stringify(activity) },
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
