import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { NavbarActionItem } from "../../_models/NavbarActionItem";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    public actionItems: NavbarActionItem[] = [
        {
            android: {
                icon: "ic_settings",
                position: "popup",
            },
            ios: {
                position: "right",
                icon: "0",
            },
            text: "Einstellungen",
            id: "settings",
        },
        {
            android: {
                icon: "stat_sys_certificate_info",
                position: "popup",
            },
            ios: {
                position: "right",
                icon: "0",
            },
            text: "Info",
            id: "info",
        },
    ];
    constructor(
        public authenticationService: AuthenticationService,
    ) { }
}
