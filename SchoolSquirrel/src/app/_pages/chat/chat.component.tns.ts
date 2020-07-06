import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";
import { AuthenticationService } from "../../_services/authentication.service";
import { ChatComponentCommon } from "./chat.component.common";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent extends ChatComponentCommon implements OnInit {
    public chats: Chat[] = [];
    constructor(
        public authenticationService: AuthenticationService,
        public remoteService: RemoteService,
    ) {
        super(authenticationService, remoteService);
    }

    public ngOnInit(): void {
        this.remoteService.get("chats").subscribe((data) => {
            this.chats = data;
            this.loading = false;
        });
    }

    public goToChat(chat: Chat): void {
        //
    }
}
