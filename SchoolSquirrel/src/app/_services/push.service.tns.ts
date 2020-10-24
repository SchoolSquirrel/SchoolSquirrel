import { Injectable } from "@angular/core";
import { firebase } from "@nativescript/firebase";
import { Device, Color } from "@nativescript/core";
import { LocalNotifications, ScheduleOptions } from "@nativescript/local-notifications";
import { StorageService } from "./storage.service";
import { AuthenticationService } from "./authentication.service";
import { RemoteService } from "./remote.service";
import { ActivityType } from "../_models/Activity";
import { PushServiceCommon } from "./push.service.common";

@Injectable({ providedIn: "root" })
export class PushService extends PushServiceCommon {
    constructor(
        public storageService: StorageService,
        public remoteService: RemoteService,
        public authenticationService: AuthenticationService,
    ) {
        super(storageService, remoteService, authenticationService);
        firebase.init({
            onMessageReceivedCallback: (message: firebase.Message) => {
                // eslint-disable-next-line no-console
                console.log(message);
                if (!message.data.silent) {
                    const n: ScheduleOptions = {
                        title: message.title,
                        body: message.body,
                        subtitle: message.data.subtitle,
                        color: message.data.color ? new Color(message.data.color) : undefined,
                        image: message.data.image ? this.remoteService.getImageUrl(
                            message.data.image, this.authenticationService,
                        ) : undefined,
                        thumbnail: message.data.thumbnail ? this.remoteService.getImageUrl(
                            message.data.thumbnail, this.authenticationService,
                        ) : undefined,
                        channel: message.data.channel,
                        actions: message.data.type == ActivityType.CHAT_MESSAGE ? [
                            {
                                id: "answer",
                                launch: false,
                                title: "Antworten",
                                type: "input",
                                placeholder: "Nachricht",
                                editable: true,
                                submitLabel: "Senden",
                            },
                            {
                                id: "markAsRead",
                                launch: false,
                                type: "button",
                                title: "Als gelesen markieren",
                            },
                        ] : undefined,
                    };
                    LocalNotifications.schedule([n]);
                }
            },
            onPushTokenReceivedCallback: (token) => this.gotToken(token, `${Device.os} ${Device.osVersion}`, Device.manufacturer),
        });
    }

    public async init(): Promise<void> {
        await this.askUserForPermission(`${Device.os} ${Device.osVersion}`, Device.manufacturer);
        if (this.hasPermission && !await LocalNotifications.hasPermission()) {
            LocalNotifications.requestPermission();
        }
    }
}
