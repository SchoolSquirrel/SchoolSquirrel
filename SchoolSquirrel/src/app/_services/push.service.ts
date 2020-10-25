import { Injectable } from "@angular/core";
import {
    START_NOTIFICATION_SERVICE,
    NOTIFICATION_SERVICE_STARTED,
    NOTIFICATION_SERVICE_ERROR,
    NOTIFICATION_RECEIVED,
    TOKEN_UPDATED,
} from "electron-push-receiver/src/constants";
import { isElectron } from "../_helpers/isElectron";
import { AuthenticationService } from "./authentication.service";
import { PushServiceCommon } from "./push.service.common";
import { RemoteService } from "./remote.service";
import { StorageService } from "./storage.service";
import { PushNotification } from "../_models/PushNotification";

@Injectable({ providedIn: "root" })
export class PushService extends PushServiceCommon {
    constructor(
        storageService: StorageService,
        remoteService: RemoteService,
        authenticationService: AuthenticationService,
    ) {
        super(storageService, remoteService, authenticationService);
        if (isElectron()) {
            const { ipcRenderer } = (<any>window).require("electron");
            // eslint-disable-next-line
            ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => (this.token = token));
            // Handle notification errors
            // eslint-disable-next-line
            ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => console.log(_, error));
            // Send FCM token to backend
            // eslint-disable-next-line
            ipcRenderer.on(TOKEN_UPDATED, (_, token) => this.gotToken(token, "SchoolSquirrel", "Desktop"));
            // Display notification
            // eslint-disable-next-line
            ipcRenderer.on(NOTIFICATION_RECEIVED, (_, notification: PushNotification) => {
                this.activities.next(JSON.parse(notification.data.payload));
                const n = new Notification(notification.notification.title, {
                    body: notification.notification.body,
                });
                n.onclick = () => {
                    // console.log("Clicked");
                };
            });
            // Start service
            ipcRenderer.send(START_NOTIFICATION_SERVICE, "815465626860");
        }
    }

    public async init(): Promise<void> {
        if (isElectron()) {
            await this.askUserForPermission("SchoolSquirrel", "Desktop");
            if (this.token) {
                this.gotToken(this.token, "SchoolSquirrel", "Desktop");
            }
        }
    }
}
