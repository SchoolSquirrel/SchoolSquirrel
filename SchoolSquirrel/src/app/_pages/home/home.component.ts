import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    title = 'Home'; // needed for AoT since you're binding to it in {N} view

    constructor(public authenticationService: AuthenticationService) {}
}
