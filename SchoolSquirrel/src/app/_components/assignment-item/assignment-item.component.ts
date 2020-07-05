import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Assignment } from "../../_models/Assignment";

@Component({
    selector: "app-assignment-item",
    templateUrl: "./assignment-item.component.html",
    styleUrls: ["./assignment-item.component.css"],
})
export class AssignmentItemComponent {
    @Input() public assignment: Assignment;

    constructor(private router: Router) { }

    public goToAssignment(assignment: Assignment): void {
        this.router.navigate(["/", "assignments", assignment.id]);
    }
}
