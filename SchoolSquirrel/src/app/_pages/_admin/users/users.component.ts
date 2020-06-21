import { Component, ViewChild } from "@angular/core";
import {
    EditSettingsModel, IEditCell, IFilterUI, GridComponent,
} from "@syncfusion/ej2-angular-grids";
import { User } from "../../../_models/User";
import { RemoteService } from "../../../_services/remote.service";
import { ToastService } from "../../../_services/toast.service";
import { Grade } from "../../../_models/Grade";
import { getDropdownFilterParams, getDropdownEditParams } from "../../../_helpers/gridFilterUI";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
    host: { style: "height: 100%; display: block" },
})
export class UsersComponent {
    public users: User[] = [];
    public grades: Grade[] = [];
    public editSettings: EditSettingsModel = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
    };
    @ViewChild("usersGrid") public usersGrid: GridComponent;
    public toolbar = ["Add", "Edit", "Delete", "Update", "Cancel"];
    public roles = [
        { name: "Schüler", value: "student" },
        { name: "Lehrer", value: "teacher" },
        { name: "Admin", value: "admin" },
    ];
    public roleParams: IEditCell = getDropdownEditParams(this.roles);
    public roleFilter: IFilterUI = getDropdownFilterParams(this.roles, "role", () => this.usersGrid);
    public gradeParams: IEditCell;
    public gradeFilter: IFilterUI;
    public filterOptions: { columns: [{ field: "username", matchCase: true, operator: "contains" }] };
    public allDataLoaded = false;

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

            this.gradeParams = getDropdownEditParams(
                this.grades.map((g) => ({ name: g.name, value: g.name })),
            );
            this.gradeFilter = getDropdownFilterParams(this.grades.map((g) => ({ name: g.name, value: g.name })), "grade.name", () => this.usersGrid);
            this.allDataLoaded = true;
        });
    }

    /* public createGrade(): void {
        if (this.newGradeName) {
            this.remoteService.post("admin/grades",
            { name: this.newGradeName }).subscribe((data) => {
                if (data && data.success) {
                    this.ngOnInit();
                    this.toastService.success("Klasse erstellt");
                }
            });
        }
    } */

    public usersActionComplete(args: {
        requestType: string; data: { id: any; username: any; role: any; grade: { name: any; }; };
    }): void {
        if (args.requestType === "save") {
            if (args.data.id) {
                this.remoteService.post(`admin/users/${args.data.id}`, {
                    name: args.data.username,
                    role: args.data.role,
                    grade: this.getGradeIdFromName(args.data.grade.name),
                }).subscribe((data) => {
                    if (data && data.success) {
                        this.toastService.success("Benutzer geändert");
                    }
                });
            } else {
                this.remoteService.post("admin/users", {
                    name: args.data.username,
                    role: args.data.role,
                    grade: this.getGradeIdFromName(args.data.grade.name),
                }).subscribe((data) => {
                    if (data && data.success) {
                        this.toastService.success("Benutzer gespeichert");
                    }
                });
            }
        } else if (args.requestType == "delete") {
            this.remoteService.delete(`admin/users/${args.data[0].id}`).subscribe((data) => {
                if (data && data.success) {
                    this.toastService.success("Benutzer gelöscht");
                }
            });
        }
    }

    public gradesActionComplete(args: {
        requestType: string; data: { id: any; name: string; };
    }): void {
        if (args.requestType === "save") {
            if (args.data.id) {
                this.remoteService.post(`admin/grades/${args.data.id}`, {
                    name: args.data.name,
                }).subscribe((data) => {
                    if (data && data.success) {
                        this.toastService.success("Klasse geändert");
                    }
                });
            } else {
                this.remoteService.post("admin/grades", {
                    name: args.data.name,
                }).subscribe((data) => {
                    if (data && data.success) {
                        this.toastService.success("Klasse gespeichert");
                    }
                });
            }
        } else if (args.requestType == "delete") {
            this.remoteService.delete(`admin/grades/${args.data[0].id}`).subscribe((data) => {
                if (data && data.success) {
                    this.toastService.success("Klasse gelöscht");
                }
            });
        }
    }

    private getGradeIdFromName(name: any): any {
        return this.grades.filter((g) => g.name == name)[0].id;
    }
}
