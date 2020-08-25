import { Component } from "@angular/core";
import { isElectron } from "../../_helpers/isElectron";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { FastTranslateService } from "../../_services/fast-translate.service";

@Component({
    selector: "app-user-settings",
    templateUrl: "./user-settings.component.html",
    styleUrls: ["./user-settings.component.scss"],
})
export class UserSettingsComponent {
    public isElectron: boolean = isElectron();
    public settings = {
        autostart: true,
        startMinimized: false,
    };
    public privacySettings = []
    constructor(
        public remoteService: RemoteService,
        public authenticationService: AuthenticationService,
        private fts: FastTranslateService,
    ) { }

    public async ngOnInit(): Promise<void> {
        for (const key of ["deliveryStatus", "onlineStatus", "lastOnline"]) {
            this.privacySettings.push({
                title: await this.fts.t(`pages.user-settings.${key}`),
                description: await this.fts.t(`pages.user-settings.${key}Description`),
                key,
            });
        }
    }
}
