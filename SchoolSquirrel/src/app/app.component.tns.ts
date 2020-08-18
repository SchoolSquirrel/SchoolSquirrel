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
        this.authenticationService.onLogin.subscribe(() => {
            this.navbarUsersService.init();
        });
    }
}
