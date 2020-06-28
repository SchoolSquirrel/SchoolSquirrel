import { Component, ChangeDetectorRef } from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
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
        public remoteService: RemoteService,
        private cdr: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.remoteService.get("courses").subscribe((data) => {
            this.courses = data;
        });
    }

    public hideDrawer(): void {
        (Application.getRootView() as unknown as RadSideDrawer).closeDrawer();
    }
}
