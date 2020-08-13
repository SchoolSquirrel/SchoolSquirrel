import { Component, Input } from "@angular/core";
import { Chat } from "../../_models/Chat";
import { User } from "../../_models/User";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-avatar",
    templateUrl: "./avatar.component.html",
    styleUrls: ["./avatar.component.scss"],
})
export class AvatarComponent {
    @Input() chat: Chat;
    @Input() user: User;
    @Input() small = false;

    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
    ) { }

    public getUrl(usePNG = false): string {
        if (this.chat) {
            return this.remoteService.getImageUrl(this.isGroupChat(this.chat) ? "" : `users/${this.getOtherUserInPrivateChat(this.chat).id}.${usePNG ? "png" : "svg"}`, this.authenticationService);
        }
        if (this.user) {
            return this.remoteService.getImageUrl(`users/${this.user.id}.${usePNG ? "png" : "svg"}`, this.authenticationService);
        }
        return "";
    }

    public getOtherUserInPrivateChat(chat: Chat): User {
        return chat.users.filter((u) => u.id != this.authenticationService.currentUser.id)[0];
    }

    public isGroupChat(chat: Chat): boolean {
        return chat.users.length > 2;
    }
}
