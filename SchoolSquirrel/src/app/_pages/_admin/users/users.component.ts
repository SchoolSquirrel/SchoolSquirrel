import { Component } from "@angular/core";
import { User } from "../../../_models/User";
import { RemoteService } from "../../../_services/remote.service";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
})
export class UsersComponent {
    public users: User[] = [];

    constructor(private remoteService: RemoteService) { }

    public ngOnInit(): void {
        this.remoteService.get("admin/users").subscribe((data: User[]) => {
            this.users = data;
        });
    }
}
