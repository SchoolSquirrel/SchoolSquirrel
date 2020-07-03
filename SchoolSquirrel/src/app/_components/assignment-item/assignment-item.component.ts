import { Component, OnInit, Input } from "@angular/core";
import { Assignment } from "../../_models/Assignment";

@Component({
    selector: "app-assignment-item",
    templateUrl: "./assignment-item.component.html",
    styleUrls: ["./assignment-item.component.css"],
})
export class AssignmentItemComponent {
  @Input() public assignment: Assignment;
}
