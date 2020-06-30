import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { isElectron } from "./_helpers/isElectron";
import { PushService } from "./_services/push.service";
import { NavbarUsersService } from "./_services/navbar-users.service";
import { AuthenticationService } from "./_services/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    isFullScreenPage: boolean;
    constructor(
        private router: Router,
        private pushService: PushService,
        private navbarUsersService: NavbarUsersService,
        private authenticationService: AuthenticationService,
    ) {
        this.router.events.subscribe((r) => {
            if (r instanceof NavigationEnd) {
                if (r.url.indexOf("login") == -1) {
                    this.isFullScreenPage = false;
                } else {
                    this.isFullScreenPage = true;
                }
            }
        });
        this.authenticationService.onLogin.subscribe(() => {
            this.navbarUsersService.init();
        });
        if (isElectron()) {
            // eslint-disable-next-line
            (<any>window).require("electron").ipcRenderer.send("ready");
        }
    }
}
