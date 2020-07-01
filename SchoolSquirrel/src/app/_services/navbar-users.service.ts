import { Injectable } from "@angular/core";
import { RemoteService } from "./remote.service";
import { AuthenticationService } from "./authentication.service";
import { User } from "../_models/User";
import { NavbarAction } from "./NavbarAction";

@Injectable({
    providedIn: "root",
})
export class NavbarUsersService {
    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
    ) { }

    public init(): void {
        this.remoteService.get("users").subscribe((users: User[]) => {
            for (const user of users) {
                (window as any).actions.push({
                    description: `Chat with ${user.name}`,
                    name: user.name,
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
