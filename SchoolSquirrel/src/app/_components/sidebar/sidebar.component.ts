import { Component, ChangeDetectorRef } from "@angular/core";
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
        private cdr: ChangeDetectorRef,
    ) { }

    public async ngOnInit(): Promise<void> {
        while (!this.authenticationService.currentUser) {
            await new Promise((resolve) => setTimeout(() => resolve(), 100));
        }
        this.remoteService.get("courses").subscribe((data) => {
            this.courses = data;
        });
    }
}
