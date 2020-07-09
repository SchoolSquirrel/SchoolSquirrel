import { Component, OnInit, ViewChild } from "@angular/core";
import { ItemEventData } from "@nativescript/core";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";
import { ChatComponentCommon } from "./chat.component.common";
import { Message } from "../../_models/Message";
import { NativescriptSquirrelChatUiComponent } from "../../_components/nativescript-squirrel-chat-ui/nativescript-squirrel-chat-ui.component";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent extends ChatComponentCommon implements OnInit {
    public chats: Chat[] = [];
    public currentChat: Chat;
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
    ) {
        super(authenticationService, remoteService);
    }
    @ViewChild("chat") public chat: NativescriptSquirrelChatUiComponent;

    public ngOnInit(): void {
        this.remoteService.get("chats").subscribe((data) => {
            this.chats = data;
            this.loading = false;
        });
    }

    public goToChat(event: ItemEventData): void {
        this.loading = true;
        this.remoteService.get(`chats/${this.chats[event.index].id}`).subscribe((data: Chat) => {
            this.currentChat = data;
            for (const message of this.currentChat.messages) {
                message.fromMe = message.sender.id
                    == this.authenticationService.currentUser.id;
            }
            this.loading = false;
        });
    }

    public onMessageSent(message: Message): void {
        this.remoteService.post(`chats/${this.currentChat.id}`, { text: message.text, citation: message.citation }).subscribe((m: Message) => {
            this.chat.lastMessageSentSuccessfully(m.id);
        });
    }
}
