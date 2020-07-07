import {
    Component, Input, Output, EventEmitter,
} from "@angular/core";
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
        this._messages.splice(0, this.messages ? this.messages.length : 0);
        this._messages.push(...val);
    }
    @Input() hideHeader = false;
    @Input() me: User;
    @Input() profileImageSource: string;
    @Input() title: string;
    @Output() back: EventEmitter<void> = new EventEmitter<void>();

    public _messages: ObservableArray<Message> = new ObservableArray<Message>();

    public goBack(): void {
        this.back.emit();
    }
}
