import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "../../_models/User";
@Component({
    selector: "app-course-config",
    templateUrl: "./course-config.component.html",
    styleUrls: ["./course-config.component.scss"],
})
export class CourseConfigComponent {
    public name = "";
    public description = "";
    public users: User[] = [];
    public loading = false;
    public invalid = false;
    public mode: "new" | "edit" = "new";
    constructor(public modal: NgbActiveModal) { }

    public createCourse(): void {
        this.loading = true;
        this.invalid = false;
        const users = this.users.map((u) => u.id);
        if (!(this.name && users && users.length > 0)) {
            this.invalid = true;
            this.loading = false;
            return;
        }
        this.modal.close({
            name: this.name,
            users,
            description: this.description,
        });
    }
}
