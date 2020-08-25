import { Injectable } from "@angular/core";
import { RemoteService } from "./remote.service";
import { AuthenticationService } from "./authentication.service";
import { User } from "../_models/User";
import { NavbarAction } from "./NavbarAction";
import { NavbarActionsService } from "./navbar-actions.service";

@Injectable({
    providedIn: "root",
})
export class NavbarUsersService {
    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private navbarActionsService: NavbarActionsService,
    ) { }

    public init(): void {
        this.remoteService.get("users").subscribe((users: User[]) => {
            const actions = [];
            for (const user of users) {
                actions.push({
                    description: `Chat with ${user.name}`,
                    name: user.name,
                    subtitle: user.grade?.name,
                    isUser: true,
                    img: this.remoteService.getImageUrl(`users/${user.id}.svg`, this.authenticationService),
                    navigateTo: `user/${user.id}`,
                    _baseRoute: "chat",
                });
            }
            this.navbarActionsService.addActions(this, actions);
        });
    }
}
