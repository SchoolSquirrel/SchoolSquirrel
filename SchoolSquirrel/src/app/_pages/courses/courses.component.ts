import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RemoteService } from "../../_services/remote.service";
import { Course } from "../../_models/Course";
import { CourseConfigComponent } from "../../_dialogs/course-config/course-config.component";

@Component({
    selector: "app-courses",
    templateUrl: "./courses.component.html",
    styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit {
    public courses: Course[] = [];
    public loading = false;
    constructor(
        private route: ActivatedRoute,
        private remoteService: RemoteService,
        private modalService: NgbModal,
        private router: Router,
    ) {}

    public ngOnInit(): void {
        this.remoteService.get("courses").subscribe((data) => {
            this.courses = data;
        });
        if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path == "new") {
            setTimeout(() => {
                this.modalService.open(CourseConfigComponent).result.then((result) => {
                    this.loading = true;
                    this.remoteService.post("courses", {
                        name: result.name,
                        description: result.description,
                        users: result.users,
                    }).subscribe((data) => {
                        if (data && data.success) {
                            this.loading = false;
                            this.router.navigate(["/courses"]);
                        }
                    });
                }, () => {
                    this.router.navigate(["/courses"]);
                });
            });
        }
    }
}
