import { Component } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { AssignmentsComponentCommon } from "./assignments.component.common";

@Component({
    selector: "app-assignments",
    templateUrl: "./assignments.component.html",
    styleUrls: ["./assignments.component.scss"],
})
export class AssignmentsComponent extends AssignmentsComponentCommon {
    constructor(
        remoteService: RemoteService,
    ) {
        super(remoteService);
    }

    public newAssignment(): void {
        //
    }
}
