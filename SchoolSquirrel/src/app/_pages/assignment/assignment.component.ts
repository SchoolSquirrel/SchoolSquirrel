import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
    constructor(
        private remoteService: RemoteService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.remoteService.get(`assignments/${this.route.snapshot.params.id}`).subscribe((data: Assignment) => {
            this.assignment = data;
        });
    }
}
