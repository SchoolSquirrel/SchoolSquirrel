import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { AssignmentsComponentCommon } from "./assignments.component.common";
import { Assignment } from "../../_models/Assignment";

@Component({
    selector: "app-assignments",
    templateUrl: "./assignments.component.html",
    styleUrls: ["./assignments.component.scss"],
})
export class AssignmentsComponent extends AssignmentsComponentCommon {
    constructor(
        remoteService: RemoteService,
        private router: Router,
    ) {
        super(remoteService);
    }

    public newAssignment(): void {
        //
    }

    public goToAssignment(assignment: Assignment): void {
        this.router.navigate(["/", "assignments", assignment.id]);
    }
}
