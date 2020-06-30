import { Component, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RemoteService } from "../../_services/remote.service";
import { Assignment } from "../../_models/Assignment";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { Course } from "../../_models/Course";

@NavbarActions([
    {
        name: "Assignments",
        description: "View all your assignments",
    },
    {
        name: "New assignment",
        description: "Create a new assignment",
        navigateTo: "new",
    },
], "assignments")
@Component({
    selector: "app-assignments",
    templateUrl: "./assignments.component.html",
    styleUrls: ["./assignments.component.scss"],
})
export class AssignmentsComponent {
    public courses: Course[] = [];
    public newAssignmentForm = new FormGroup({
        title: new FormControl("", [Validators.required]),
        content: new FormControl("", [Validators.required]),
        course: new FormControl("", [Validators.required]),
        date: new FormControl("", [Validators.required]),
        timeHours: new FormControl("23", [Validators.required, Validators.min(0), Validators.max(23)]),
        timeMinutes: new FormControl("59", [Validators.required, Validators.min(0), Validators.max(59)]),
    });
    constructor(
        private remoteService: RemoteService,
        private modalService: NgbModal,
    ) { }

    public newAssignment(content: ElementRef): void {
        this.modalService.open(content, { size: "xl" }).result.then((result) => {
            if (result.newTitle && result.newContent) {
                this.remoteService.post("assignments", { title: result.newTitle, content: result.newContent }).subscribe((data) => {
                    if (data && data.success) {
                        this.loadAssignments();
                    }
                });
            }
        }, () => undefined);
    }

    public ngOnInit(): void {
        this.loadAssignments();
    }

    public viewAssignment(assignment: Assignment): void {
        this.remoteService.get(`assignments/${assignment.id}`).subscribe((data) => {
            // eslint-disable-next-line no-alert
            alert(JSON.stringify(data));
        });
    }

    private loadAssignments() {
        this.remoteService.get("assignments").subscribe((data: Course[]) => {
            if (data) {
                this.courses = data;
            }
        });
    }
}
