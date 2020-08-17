import { Component, Input } from "@angular/core";
import { Assignment } from "../../_models/Assignment";
import { AssignmentSubmission } from "../../_models/AssignmentSubmission";

@Component({
    selector: "app-assignment-statusbar",
    templateUrl: "./assignment-statusbar.component.html",
    styleUrls: ["./assignment-statusbar.component.scss"],
})
export class AssignmentStatusbarComponent {
    @Input() public assignment: Assignment;

    public filterReturned(submissions: AssignmentSubmission[]): AssignmentSubmission[] {
        return submissions.filter((s) => !!s.returned);
    }
}
