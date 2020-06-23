import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../_models/User";
import { RemoteService } from "../../_services/remote.service";
import { Course } from "../../_models/Course";

@Component({
    selector: "app-courses",
    templateUrl: "./courses.component.html",
    styleUrls: ["./courses.component.css"],
})
export class CoursesComponent implements OnInit {
    public newCourse = false;
    public newCourseName = "";
    public newCourseUsers: User[] = [];
    public loading = false;
    public invalid = false;
    public courses: Course[] = [];

    constructor(
        private route: ActivatedRoute,
        private remoteService: RemoteService,
        private router: Router,
    ) {
        if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path == "new") {
            this.newCourse = true;
        }
    }

    public ngOnInit(): void {
        this.remoteService.get("courses").subscribe((data) => {
            this.courses = data;
        });
    }

    public createCourse(): void {
        this.loading = true;
        this.invalid = false;
        const users = this.newCourseUsers.map((u) => u.id);
        if (!(this.newCourseName && users && users.length > 0)) {
            this.invalid = true;
            this.loading = false;
            return;
        }
        this.remoteService.post("courses", {
            name: this.newCourseName,
            users,
        }).subscribe((data) => {
            if (data && data.success) {
                this.loading = false;
                this.router.navigate(["/courses"]);
            }
        });
    }
}
