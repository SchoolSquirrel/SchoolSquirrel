import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Activity, ActivityType } from "../../_models/Activity";
import { PushService } from "../../_services/push.service";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";
import { Message } from "../../_models/Message";
import { MessageStatus } from "../../_models/MessageStatus";
import { ChatComponentCommon } from "./chat.component.common";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends ChatComponentCommon implements OnInit {
    public chats: Chat[] = [];
    public currentChat: Chat;
    public subscription: Subscription;
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
        public router: Router,
        private pushService: PushService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
    ) {
        super(authenticationService, remoteService, router);
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.subscription?.unsubscribe();
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
                    this.subscription = this.pushService
                        .filter(ActivityType.CHAT_MESSAGE)
                        .subscribe((d: Activity) => {
                            this.currentChat.messages.push(d.payload);
                            this.cdr.detectChanges();
                        });
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
}
