import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
    constructor(public authenticationService: AuthenticationService) {}
}
