import { Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";
import { User } from "../../_models/User";
import { Conference } from "../../_models/Conference";

export class ChatComponentCommon {
    public loading = true;
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
        public router: Router,
    ) {}

    public getChatName(chat: Chat): string {
        return chat.name ? chat.name : this.isGroupChat(chat) ? chat.users.map((u) => u.name.split(" ")[0]).join(", ") : this.getOtherUserInPrivateChat(chat).name;
    }

    public getOtherUserInPrivateChat(chat: Chat): User {
        return chat.users.filter((u) => u.id != this.authenticationService.currentUser.id)[0];
    }

    public isGroupChat(chat: Chat): boolean {
        return chat.users.length > 2;
    }

    public getChatImageUrl(currentChat: Chat, usePNG = false): string {
        return this.remoteService.getImageUrl(this.isGroupChat(currentChat) ? "" : `users/${this.getOtherUserInPrivateChat(currentChat).id}.${usePNG ? "png" : "svg"}`, this.authenticationService);
    }

    public startConference(chat: Chat, audioOnly = false): void {
        this.loading = true;
        let options = {};
        if (this.isGroupChat(chat)) {
            options = {
                type: "group",
                users: chat.users
                    .map((u) => u.id)
                    .filter((u) => u !== this.authenticationService.currentUser.id),
            };
        } else {
            options = {
                type: "private",
                users: [this.getOtherUserInPrivateChat(chat).id],
            };
        }
        this.remoteService.post("conferences", options).subscribe((c: Conference) => {
            this.loading = false;
            if (c && c.id) {
                this.router.navigate(["conference", c.id], audioOnly ? { queryParams: { onlyAudio: true } } : {});
            }
        }, () => {
            this.loading = false;
        });
    }
}
