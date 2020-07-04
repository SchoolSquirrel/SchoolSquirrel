import { Component, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { Assignment } from "../../_models/Assignment";

@Component({
    selector: "app-assignment",
    templateUrl: "./assignment.component.html",
    styleUrls: ["./assignment.component.scss"],
})
export class AssignmentComponent {
    public assignment: Assignment;
    loading: boolean;
    constructor(
        private remoteService: RemoteService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.loading = false;
        this.remoteService.get(`assignments/${this.route.snapshot.params.id}`).subscribe((data: Assignment) => {
            this.assignment = data;
        });
    }
}
