import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";
import { Message } from "../../_models/Message";
import { MessageStatus } from "../../_models/MessageStatus";
import { ChatComponentCommon } from "./chat.component.common";
import { User } from "../../_models/User";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends ChatComponentCommon implements OnInit {
    public chats: Chat[] = [];
    public currentChat: Chat;
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super(authenticationService, remoteService);
    }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params.id && this.route.snapshot.url.map((u) => u.toString()).includes("user")) {
                this.remoteService.get(`chats/user/${params.id}`).subscribe((chat) => {
                    this.navigateToChat(chat);
                });
                return;
            }
            if (params.id) {
                this.remoteService.get(`chats/${params.id}`).subscribe((chat) => {
                    this.currentChat = chat;
                    for (const message of this.currentChat.messages) {
                        message.fromMe = message.sender.id
                            == this.authenticationService.currentUser.id;
                    }
                });
            }
        });
        this.remoteService.get("chats").subscribe((data) => {
            this.chats = data;
            this.loading = false;
            if (!this.route.snapshot.params.id) {
                this.navigateToChat(this.chats[0]);
            }
        });
    }

    private navigateToChat(chat: any) {
        this.router.navigate(["/", "chat", chat.id]);
    }

    public onMessageSent(message: Message): void {
        this.remoteService.post(`chats/${this.currentChat.id}`, { text: message.text, citation: message.citation }).subscribe((m: Message) => {
            Object.assign(this.currentChat.messages[this.currentChat.messages.indexOf(message)], m);
            this.currentChat.messages[this.currentChat.messages.findIndex((msg) => msg.id == m.id)]
                .status = MessageStatus.Sent;
        });
    }

    public getChatImageUrl(currentChat: Chat, usePNG = false): string {
        return this.remoteService.getImageUrl(this.isGroupChat(currentChat) ? "" : `users/${this.getOtherUserInPrivateChat(currentChat).id}.${usePNG ? "png" : "svg"}`, this.authenticationService);
    }

    public getOtherUserInPrivateChat(chat: Chat): User {
        return chat.users.filter((u) => u.id != this.authenticationService.currentUser.id)[0];
    }

    public isGroupChat(chat: Chat): boolean {
        return chat.users.length > 2;
    }
}
