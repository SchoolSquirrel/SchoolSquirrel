import { Component } from "@angular/core";

@Component({
    selector: "app-assignments",
    templateUrl: "./assignments.component.html",
    styleUrls: ["./assignments.component.scss"],
})
export class AssignmentsComponent {
    title = 'Assignments'; // needed for AoT since you're binding to it in {N} view
}
