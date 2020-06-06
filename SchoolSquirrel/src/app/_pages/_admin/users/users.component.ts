import { Component } from "@angular/core";
import { User } from "../../../_models/User";
import { RemoteService } from "../../../_services/remote.service";
import { ToastService } from "../../../_services/toast.service";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
})
export class UsersComponent {
    public users: User[] = [];
    public newUserRole = "student";
    public newUserName: string;

    constructor(private remoteService: RemoteService, private toastService: ToastService) { }

    public ngOnInit(): void {
        this.remoteService.get("admin/users").subscribe((data: User[]) => {
            this.users = data;
        });
    }

    public createUser(): void {
        if (this.newUserName && this.newUserRole) {
            this.remoteService.post("admin/users", { name: this.newUserName, role: this.newUserRole }).subscribe((data) => {
                if (data && data.success) {
                    this.ngOnInit();
                    this.toastService.success("Benutzer erstellt");
                }
            });
        }
    }
}
