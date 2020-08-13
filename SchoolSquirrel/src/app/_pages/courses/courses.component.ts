import {
    Component, OnInit, ViewChild, ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "../../_models/User";
import { RemoteService } from "../../_services/remote.service";
import { Course } from "../../_models/Course";

@Component({
    selector: "app-courses",
    templateUrl: "./courses.component.html",
    styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit {
    public newCourseName = "";
    public newCourseUsers: User[] = [];
    public loading = false;
    public invalid = false;
    public courses: Course[] = [];
    @ViewChild("content") private modal: ElementRef;

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
                this.modalService.open(this.modal).result.then(() => {
                    if (!this.invalid) {
                        this.createCourse();
                    }
                }, () => {
                    this.router.navigate(["/courses"]);
                });
            });
        }
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
        this.modalService.dismissAll();
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
