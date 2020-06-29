import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";
import { NavbarAction } from "../../_services/NavbarAction";
import { User } from "../../_models/User";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
    ) { }

    public ngOnInit(): void {
        this.remoteService.get("users").subscribe((users: User[]) => {
            for (const user of users) {
                (window as any).actions.push({
                    description: `Chat with ${user.username}`,
                    name: user.username,
                    subtitle: user.grade?.name,
                    isUser: true,
                    img: this.remoteService.getImageUrl(`users/${user.id}.svg`, this.authenticationService),
                    navigateTo: `user/${user.id}`,
                    _baseRoute: "chat",
                } as NavbarAction);
            }
        });
    }
}
