import { Component } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { Assignment } from "../../_models/Assignment";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";

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
    public newTitle = "";
    public newContent = "";
    public assignments: Assignment[] = [];
    constructor(private remoteService: RemoteService) {}
    public newAssignment(): void {
        if (this.newTitle && this.newContent) {
            this.remoteService.post("assignments", { title: this.newTitle, content: this.newContent }).subscribe((data) => {
                if (data && data.success) {
                    this.loadAssignments();
                }
            });
        }
        this.newTitle = "";
        this.newContent = "";
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
        this.remoteService.get("assignments").subscribe((data) => {
            if (data) {
                this.assignments = data;
            }
        });
    }
}
