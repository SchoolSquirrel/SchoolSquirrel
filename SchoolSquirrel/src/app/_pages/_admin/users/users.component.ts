import { Component } from "@angular/core";
import { User } from "../../../_models/User";
import { RemoteService } from "../../../_services/remote.service";
import { ToastService } from "../../../_services/toast.service";
import { Grade } from "../../../_models/Grade";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
})
export class UsersComponent {
    public users: User[] = [];
    public grades: Grade[] = [];
    public newUserRole = "student";
    public newUserName: string;
    public newGradeName: string;
    public newUserGradeId = "";

    constructor(private remoteService: RemoteService, private toastService: ToastService) { }

    public ngOnInit(): void {
        this.remoteService.get("admin/users").subscribe((data: User[]) => {
            this.users = data;
        });
        this.remoteService.get("admin/grades").subscribe((data: Grade[]) => {
            this.grades = data;
            this.grades = this.grades.map((g: any) => {
                g.usersFormatted = g.users.map((u) => u.username).join(", ");
                return g;
            });
        });
    }

    public createUser(): void {
        if (this.newUserName && this.newUserRole && this.newUserGradeId) {
            this.remoteService.post("admin/users", { name: this.newUserName, role: this.newUserRole, grade: this.newUserGradeId }).subscribe((data) => {
                if (data && data.success) {
                    this.ngOnInit();
                    this.toastService.success("Benutzer erstellt");
                }
            });
        }
    }

    public createGrade(): void {
        if (this.newGradeName) {
            this.remoteService.post("admin/grades", { name: this.newGradeName }).subscribe((data) => {
                if (data && data.success) {
                    this.ngOnInit();
                    this.toastService.success("Klasse erstellt");
                }
            });
        }
    }

    public saveUser(user: User): void {
        this.remoteService.post(`admin/users/${user.id}`, { name: user.username, role: user.role, grade: user.grade.id }).subscribe((data) => {
            if (data && data.success) {
                this.toastService.success("Benutzer geändert");
            }
        });
    }
}
