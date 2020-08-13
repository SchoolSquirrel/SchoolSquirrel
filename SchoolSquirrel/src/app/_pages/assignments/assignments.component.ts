import { Component, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, map } from "rxjs/operators";
import { RemoteService } from "../../_services/remote.service";
import { TinyConfigService } from "../../_services/tiny-config.service";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { AssignmentsComponentCommon } from "./assignments.component.common";
import { Assignment } from "../../_models/Assignment";
import { AuthenticationService } from "../../_services/authentication.service";

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
    public saving: boolean;
    public saved: boolean;
    public assignmentWorksheets: any[] = [];
    public assignmentMaterials: any[] = [];
    constructor(
        remoteService: RemoteService,
        public tinyConfigService: TinyConfigService,
        private modalService: NgbModal,
        public authenticationService: AuthenticationService,
    ) {
        super(remoteService);
    }

    public newAssignment(content: ElementRef): void {
        this.remoteService.get("assignments/draft").subscribe((a: Assignment) => {
            this.newAssignmentId = a.id;
            this.assignmentMaterials = a.materials;
            this.assignmentWorksheets = a.worksheets;
            this.newAssignmentForm.controls.title.setValue(a.title);
            this.newAssignmentForm.controls.content.setValue(a.content);
            const due = new Date(a.due);
            this.newAssignmentForm.controls.date.setValue(
                { year: due.getFullYear(), month: due.getMonth() + 1, day: due.getDate() },
            );
            this.newAssignmentForm.controls.timeHours.setValue(due?.getHours());
            this.newAssignmentForm.controls.timeMinutes.setValue(due?.getMinutes());
        });
        this.newAssignmentForm.valueChanges.pipe(
            debounceTime(1000),
            map(() => this.saveDraft()),
        ).subscribe();
        this.modalService.open(content, { size: "xl" }).result.then((finished: boolean) => {
            this.newAssignmentId = undefined;
            if (finished && this.newAssignmentForm.valid) {
                this.submitted = false;
                this.remoteService.post("assignments", this.getAssignmentPostData()).subscribe(() => {
                    this.loadAssignments();
                });
            }
        }, () => undefined);
    }

    public saveDraft(): void {
        this.saving = true;
        this.saved = false;
        this.remoteService.post("assignments/draft", this.getAssignmentPostData()).subscribe(() => {
            this.saved = true;
            this.saving = false;
            setTimeout(() => {
                this.saved = false;
            }, 2000);
        });
    }

    private getAssignmentPostData(): { [key: string]: any; } {
        return {
            title: this.newAssignmentForm.controls.title.value,
            content: this.newAssignmentForm.controls.content.value,
            course: this.newAssignmentForm.controls.course.value,
            due: new Date(
                this.newAssignmentForm.controls.date?.value?.year,
                this.newAssignmentForm.controls.date?.value?.month - 1,
                this.newAssignmentForm.controls.date?.value?.day,
                this.newAssignmentForm.controls.timeHours.value,
                this.newAssignmentForm.controls.timeMinutes.value,
            ),
        };
    }
}
