import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import { Course } from "../../_models/Course";
import { RemoteService } from "../../_services/remote.service";
import { Assignment } from "../../_models/Assignment";

@Component({ template: "" })
export class AssignmentsComponentCommon {
    public newAssignmentId: number;
    public courses: Course[] = [];
    public newAssignmentForm = new FormGroup({
        title: new FormControl("", [Validators.required]),
        content: new FormControl("", [Validators.required]),
        course: new FormControl("", [Validators.required]),
        date: new FormControl("", [Validators.required]),
        timeHours: new FormControl("23", [Validators.required, Validators.min(0), Validators.max(23)]),
        timeMinutes: new FormControl("59", [Validators.required, Validators.min(0), Validators.max(59)]),
    });
    public submitted = false;
    public activeIds: string[] = [];
    constructor(
        public remoteService: RemoteService,
    ) { }

    public ngOnInit(): void {
        this.loadAssignments();
    }

    public viewAssignment(assignment: Assignment): void {
        this.remoteService.get(`assignments/${assignment.id}`).subscribe((data) => {
            // eslint-disable-next-line no-alert
            alert(JSON.stringify(data));
        });
    }

    public loadAssignments(): void {
        this.remoteService.get("assignments").subscribe((data: Course[]) => {
            if (data) {
                this.courses = data;
                this.activeIds = this.courses.map((c) => (`panel-${c.id}`));
            }
        });
    }
}
