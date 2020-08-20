import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Device } from "@nativescript/core";
import { StorageService } from "./storage.service";
import { AuthenticationService } from "./authentication.service";
import { RemoteService } from "./remote.service";

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
                // eslint-disable-next-line no-alert
                alert("message received!");
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
    }
}
