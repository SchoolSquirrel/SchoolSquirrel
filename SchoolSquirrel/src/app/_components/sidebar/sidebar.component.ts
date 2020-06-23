import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";
import { Course } from "../../_models/Course";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
    public courses: Course[] = [];
    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
    ) { }

    public ngOnInit(): void {
        this.remoteService.get("courses").subscribe((data) => {
            this.courses = data;
        });
    }
}
