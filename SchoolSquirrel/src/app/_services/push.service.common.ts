import { AuthenticationService } from "./authentication.service";
import { RemoteService } from "./remote.service";
import { StorageService } from "./storage.service";

declare function confirm (options: any): Promise<boolean>;

export class PushServiceCommon {
    // undefined for not asked, false for disallowed, true for allowed
    public hasPermission: boolean;
    public token: string;
    public readonly KEY = "push-notifications-allowed";

    constructor(
        public storageService: StorageService,
        public remoteService: RemoteService,
        public authenticationService: AuthenticationService,
    ) {
        this.hasPermission = this.storageService.get(this.KEY);
        this.authenticationService.onLogin.subscribe(() => {
            this.init();
        });
    }

    public init(): void {
        //
    }

    public async askUserForPermission(os: string, device: string): Promise<void> {
        if (this.hasPermission === undefined || this.hasPermission === null) {
            this.hasPermission = await confirm("Möchtest du Push Nachrichten erhalten?");
            this.storageService.set(this.KEY, this.hasPermission);
            if (this.hasPermission && this.token) {
                this.gotToken(this.token, os, device);
            }
        }
    }

    public gotToken(token: string, os: string, device: string): void {
        this.token = token;
        if (this.hasPermission === true) {
            console.log("updated token to", token);
            this.remoteService.post("devices", {
                token,
                os,
                device,
                software: "SchoolSquirrel App",
            }).subscribe(() => undefined, () => undefined);
        }
    }
}
