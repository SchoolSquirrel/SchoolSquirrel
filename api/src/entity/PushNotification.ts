import { ActivityType } from "./Activity";

export type PushNotificationInfo = {
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
    payload: string;
    [key: string]: any,
};

export type PushNotification = {
    data: PushNotificationData,
    notification: PushNotificationInfo,
    priority: string,
    from: string,
};
