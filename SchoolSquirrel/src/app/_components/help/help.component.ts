import { Component, Input } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-help",
    templateUrl: "./help.component.html",
    styleUrls: ["./help.component.scss"],
})
export class HelpComponent {
    @Input() docs = "";
    @Input() white = false;
    @Input() large = false;

    constructor(private authenticationService: AuthenticationService) { }

    public getDocsLink(): string {
        return `https://schoolsquirrel.github.io/SchoolSquirrel/${this.docs.replace("userrole", `${this.authenticationService.currentUser?.role || "student"}s`)}`;
    }
}
