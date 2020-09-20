import { Injectable } from "@angular/core";
import { firebase } from "@nativescript/firebase";
import { Device, Color } from "@nativescript/core";
import { LocalNotifications, ScheduleOptions } from "@nativescript/local-notifications";
import { StorageService } from "./storage.service";
import { AuthenticationService } from "./authentication.service";
import { RemoteService } from "./remote.service";
import { NotificationCategory } from "../_models/NotificationCategory";

declare function confirm (options: any): Promise<boolean>;
const KEY = "push-notifications-allowed";

@Injectable({ providedIn: "root" })
export class PushService {
    // undefined for not asked, false for disallowed, true for allowed
    private hasPermission: boolean;
    private token: string;
    constructor(
        private storageService: StorageService,
        private authenticationService: AuthenticationService,
        private remoteService: RemoteService,
    ) {
        this.hasPermission = this.storageService.get(KEY);
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
                        actions: message.data.type == NotificationCategory.ChatMessage ? [
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
            onPushTokenReceivedCallback: (token) => this.gotToken(token),
        });
        this.authenticationService.onLogin.subscribe(() => {
            this.init();
        });
    }

    private gotToken(token) {
        this.token = token;
        if (this.hasPermission === true) {
            this.remoteService.post("devices", {
                token,
                os: `${Device.os} ${Device.osVersion}`,
                device: Device.manufacturer,
                software: "SchoolSquirrel App",
            }).subscribe(() => undefined, () => undefined);
        }
    }

    public async init(): Promise<void> {
        if (this.hasPermission === undefined) {
            this.hasPermission = await confirm("Möchtest du Push Nachrichten erhalten?");
            this.storageService.set(KEY, this.hasPermission);
            if (this.hasPermission && this.token) {
                this.gotToken(this.token);
            }
        }
        if (this.hasPermission && !await LocalNotifications.hasPermission()) {
            LocalNotifications.requestPermission();
        }
    }
}
