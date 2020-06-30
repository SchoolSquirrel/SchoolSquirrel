import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
    public chats: Chat[] = [];
    public currentChat: Chat;
    public loading = true;
    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params.id && this.route.snapshot.url.map((u) => u.toString()).includes("user")) {
                this.remoteService.get(`chats/user/${params.id}`).subscribe((chat) => {
                    this.navigateToChat(chat);
                });
                return;
            }
            if (!params.id) {
                this.navigateToChat(this.chats[0]);
                return;
            }
            this.remoteService.get(`chats/${params.id}`).subscribe((chat) => {
                this.currentChat = chat;
            });
        });
        this.remoteService.get("chats").subscribe((data) => {
            this.chats = data;
            this.loading = false;
        });
    }

    private navigateToChat(chat: any) {
        this.router.navigate(["/", "chat", chat.id]);
    }

    public getChatName(chat: Chat): string {
        return chat.name ? chat.name : this.isGroupChat(chat) ? chat.users.map((u) => u.username.split(" ")[0]).join(", ") : this.getOtherUserInPrivateChat(chat).username;
    }

    private getOtherUserInPrivateChat(chat: Chat) {
        return chat.users.filter((u) => u.id != this.authenticationService.currentUser.id)[0];
    }

    public isGroupChat(chat: Chat): boolean {
        return chat.users.length > 2;
    }

    public getChatImageUrl(chat: Chat): string {
        return this.remoteService.getImageUrl(this.isGroupChat(chat) ? "" : `users/${this.getOtherUserInPrivateChat(chat).id}.svg`, this.authenticationService);
    }
}
