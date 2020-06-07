import { Injectable } from "@angular/core";
import {
    START_NOTIFICATION_SERVICE,
    NOTIFICATION_SERVICE_STARTED,
    NOTIFICATION_SERVICE_ERROR,
    NOTIFICATION_RECEIVED,
    TOKEN_UPDATED,
} from "electron-push-receiver/src/constants";
import { isElectron } from "../_helpers/isElectron";

@Injectable({ providedIn: "root" })
export class PushService {
    constructor() {
        if (isElectron()) {
            const { ipcRenderer } = (<any>window).require("electron");
            // eslint-disable-next-line
            ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => console.log(_, token));
            // Handle notification errors
            // eslint-disable-next-line
            ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => console.log(_, error));
            // Send FCM token to backend
            // eslint-disable-next-line
            ipcRenderer.on(TOKEN_UPDATED, (_, token) => console.log(_, token));
            // Display notification
            // eslint-disable-next-line
            ipcRenderer.on(NOTIFICATION_RECEIVED, (_, notification) => console.log(_, notification));
            // Start service
            ipcRenderer.send(START_NOTIFICATION_SERVICE, "");
        }
    }
}
