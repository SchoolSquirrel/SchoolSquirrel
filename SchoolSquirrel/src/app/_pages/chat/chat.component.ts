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
import { ACTIVE_CHAT_PAYLOAD, SocketEvent } from "../../_models/SocketEvent";
import { ChatComponentCommon } from "./chat.component.common";
import { SocketService } from "../../_services/socket.service";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends ChatComponentCommon implements OnInit {
    public chats: Chat[] = [];
    public currentChat: Chat;
    public pushSubscription: Subscription;
    public typingUsername: string;
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
        public router: Router,
        public socketService: SocketService,
        private pushService: PushService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
    ) {
        super(authenticationService, remoteService, router);
    }

    public ngOnDestroy(): void {
        this.pushSubscription?.unsubscribe();
        this.socketService.socket.off(SocketEvent.USER_ONLINE_STATUS,
            this.onUserOnlineStatusChange());
        this.socketService.socket.off(SocketEvent.USER_TYPING_STATUS,
            this.onUserTypingStatusChange());
        this.socketService.socket.emit(SocketEvent.ACTIVE_CHAT, { chatId: null } as ACTIVE_CHAT_PAYLOAD);
    }

    public ngOnInit(): void {
        this.socketService.socket.on(SocketEvent.USER_ONLINE_STATUS,
            this.onUserOnlineStatusChange());
        this.socketService.socket.on(SocketEvent.USER_TYPING_STATUS,
            this.onUserTypingStatusChange());
        this.route.params.subscribe((params) => {
            this.pushSubscription?.unsubscribe();
            if (params.id && this.route.snapshot.url.map((u) => u.toString()).includes("user")) {
                this.remoteService.get(`chats/user/${params.id}`).subscribe((chat) => {
                    this.navigateToChat(chat);
                });
                return;
            }
            if (params.id) {
                this.socketService.socket.emit(SocketEvent.ACTIVE_CHAT, { chatId: params.id } as ACTIVE_CHAT_PAYLOAD);
                this.remoteService.get(`chats/${params.id}`).subscribe((chat) => {
                    this.currentChat = chat;
                    for (const message of this.currentChat.messages) {
                        message.fromMe = message.sender.id
                            == this.authenticationService.currentUser.id;
                    }
                    this.pushSubscription = this.pushService
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

    private onUserOnlineStatusChange(): (d: { userId: string, online: boolean }) => void {
        return (d: { userId: string, online: boolean }) => {
            if (this.currentChat) {
                if (!this.isGroupChat(this.currentChat)
                    && d.userId == this.getOtherUserInPrivateChat(this.currentChat).id
                ) {
                    this.currentChat.info = d.online ? "Online" : "Last seen: Just now";
                }
            }
        };
    }

    private onUserTypingStatusChange(): (d: { username: string, typing: boolean }) => void {
        return (d: { username: string, typing: boolean }) => {
            if (this.currentChat) {
                this.typingUsername = d.typing ? d.username : undefined;
            }
        };
    }

    public onUserTyping(typing: boolean): void {
        console.log("emitting", typing);
        this.socketService.socket.emit(SocketEvent.USER_TYPING_STATUS, typing);
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
