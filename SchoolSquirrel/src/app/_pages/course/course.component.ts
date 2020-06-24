import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../../_models/Course";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-course",
    templateUrl: "./course.component.html",
    styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
    public course: Course;

    constructor(private remoteService: RemoteService, private route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.remoteService.get(`courses/${this.route.snapshot.params.id}`).subscribe((data) => {
            this.course = data;
        });
    }
}
