import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { Chat } from "../../_models/Chat";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
    public chats: Chat[] = [];
    constructor(private remoteService: RemoteService) { }

    public ngOnInit(): void {
        this.remoteService.get("chats").subscribe((data) => {
            this.chats = data;
        });
    }
}
