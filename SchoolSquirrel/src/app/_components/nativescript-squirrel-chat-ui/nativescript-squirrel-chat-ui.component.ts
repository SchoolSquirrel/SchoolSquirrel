import { Component, Input } from "@angular/core";
import { ObservableArray } from "@nativescript/core";
import { Message } from "../../_models/Message";
import { User } from "../../_models/User";

@Component({
    selector: "nativescript-squirrel-chat-ui",
    templateUrl: "./nativescript-squirrel-chat-ui.component.html",
    styleUrls: ["./nativescript-squirrel-chat-ui.component.css"],
})
export class NativescriptSquirrelChatUiComponent {
    @Input()
    set messages(val: Message[]) {
        this.messages.splice(0, this.messages.length);
        this._messages.push(...this.messages);
    }
    @Input() hideHeader = false;
    @Input() me: User;

    public _messages: ObservableArray<Message> = new ObservableArray<Message>();
}
