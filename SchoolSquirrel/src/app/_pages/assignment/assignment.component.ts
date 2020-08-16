import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { Assignment } from "../../_models/Assignment";
import { AuthenticationService } from "../../_services/authentication.service";

type Tab = "student" | "teacher" | "submissions";

@Component({
    selector: "app-assignment",
    templateUrl: "./assignment.component.html",
    styleUrls: ["./assignment.component.scss"],
})
export class AssignmentComponent {
    public assignment: Assignment;
    public activeTab: Tab = "student";
    public showSubmissionMessageField = false;
    public submissionMessage = "";
    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.activeTab = params.tab || "student";
            if (parseInt(params.id, 10) != this.assignment?.id) {
                this.assignment = undefined;
                this.remoteService.get(`assignments/${params.id}`).subscribe((data: Assignment) => {
                    this.assignment = data;
                });
            }
        });
    }

    public tabChanged(tab: Tab): void {
        this.router.navigate(["/assignments", this.assignment.id, tab]);
    }

    public submitAssignment(): void {
        if (this.assignment.worksheets.filter((w) => !w.worksheetHasAlreadyBeenEdited).length) {
            // eslint-disable-next-line
            if (!confirm("Du hast nicht alle Arbeitsblätter bearbeitet. Willst du die Aufgabe wirklich abgeben?")) {
                return;
            }
        }
        if (!this.assignment.submissions?.length && !this.submissionMessage.trim()) {
            // eslint-disable-next-line
            if (!confirm("Du hast keine Dateien angehängt und keine Nachricht geschrieben. Möchtest du diese Aufgabe also ohne weitere Infos abgeben? Wenn nicht, klicke jetzt auf 'Abbrechen'.")) {
                return;
            }
        }
        this.remoteService.post(`assignments/${this.assignment.id}/submit`, { message: this.submissionMessage }).subscribe((d) => {
            if (d.success) {
                this.assignment.submitted = new Date();
            }
        });
    }
}
