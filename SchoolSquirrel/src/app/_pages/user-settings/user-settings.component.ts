import { Component } from "@angular/core";
import { isElectron } from "../../_helpers/isElectron";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";

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
    public privacySettings = [
        {
            title: "Lesebestätigungen",
            description: "Anderen Personen im Chat anzeigen, ob Nachrichten gelesen wurden. Wenn Du diese Einstellung deaktivierst, kannst Du auch die Lesebestätigungen von anderen Personen nicht sehen.",
            key: "deliveryStatus",
        },
        {
            title: "Online-Status",
            description: "Anderen Personen anzeigen, ob Du gerade online bist. Wenn Du diese Einstellung deaktivierst, kannst Du auch den Online-Status anderer Personen nicht sehen.",
            key: "onlineStatus",
        },
        {
            title: "Zuletzt Online",
            description: "Anderen Personen anzeigen, wann Du zuletzt online warst. Wenn Du diese Einstellung deaktivierst, kannst Du auch den Zuletzt Online Zeitpunkt anderer Personen nicht sehen.",
            key: "lastOnline",
        },
    ]
    constructor(
        public remoteService: RemoteService,
        public authenticationService: AuthenticationService,
    ) { }
}
