import { Component, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RemoteService } from "../../_services/remote.service";
import { TinyConfigService } from "../../_services/tiny-config.service";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { AssignmentsComponentCommon } from "./assignments.component.common";

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
export class AssignmentsComponent extends AssignmentsComponentCommon {
    constructor(
        remoteService: RemoteService,
        public tinyConfigService: TinyConfigService,
        private modalService: NgbModal,
    ) {
        super(remoteService);
    }

    public newAssignment(content: ElementRef): void {
        this.modalService.open(content, { size: "xl" }).result.then(() => {
            if (this.newAssignmentForm.valid) {
                this.submitted = false;
                this.remoteService.post("assignments", {
                    title: this.newAssignmentForm.controls.title.value,
                    content: this.newAssignmentForm.controls.content.value,
                    course: this.newAssignmentForm.controls.course.value,
                    due: new Date(
                        this.newAssignmentForm.controls.date.value.year,
                        this.newAssignmentForm.controls.date.value.month - 1,
                        this.newAssignmentForm.controls.date.value.day,
                        this.newAssignmentForm.controls.timeHours.value,
                        this.newAssignmentForm.controls.timeMinutes.value,
                    ),
                }).subscribe((data) => {
                    if (data && data.success) {
                        this.newAssignmentForm.reset();
                        this.loadAssignments();
                    }
                });
            }
        }, () => undefined);
    }
}
