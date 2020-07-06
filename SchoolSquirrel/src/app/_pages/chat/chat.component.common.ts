import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";
import { User } from "../../_models/User";

export class ChatComponentCommon {
    public loading = true;
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
    ) { }

    public getChatName(chat: Chat): string {
        return chat.name ? chat.name : this.isGroupChat(chat) ? chat.users.map((u) => u.name.split(" ")[0]).join(", ") : this.getOtherUserInPrivateChat(chat).name;
    }

    public getOtherUserInPrivateChat(chat: Chat): User {
        return chat.users.filter((u) => u.id != this.authenticationService.currentUser.id)[0];
    }

    public isGroupChat(chat: Chat): boolean {
        return chat.users.length > 2;
    }

    public getChatImageUrl(chat: Chat, usePNG = false): string {
        return this.remoteService.getImageUrl(this.isGroupChat(chat) ? "" : `users/${this.getOtherUserInPrivateChat(chat).id}.${usePNG ? "png" : "svg"}`, this.authenticationService);
    }
}
