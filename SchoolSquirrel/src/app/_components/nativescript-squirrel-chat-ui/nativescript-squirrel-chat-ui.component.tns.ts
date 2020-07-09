import {
    Component, Input, Output, EventEmitter, ViewChild,
} from "@angular/core";
import { ObservableArray } from "@nativescript/core";
import { Message } from "../../_models/Message";
import { User } from "../../_models/User";
import { MessageStatus } from "../../_models/MessageStatus";

@Component({
    selector: "nativescript-squirrel-chat-ui",
    templateUrl: "./nativescript-squirrel-chat-ui.component.html",
    styleUrls: ["./nativescript-squirrel-chat-ui.component.scss"],
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
    @Output() messageSent: EventEmitter<Message> = new EventEmitter<Message>();
    @ViewChild("messageInput") public messageInput;

    public _messages: ObservableArray<Message> = new ObservableArray<Message>();

    public goBack(): void {
        this.back.emit();
    }

    public isContinuing(message: Message): boolean {
        const index = this._messages.indexOf(message);
        return this._messages[index]
            && this._messages[index - 1]
            && this._messages[index].sender == this._messages[index - 1].sender;
    }

    public toggleEmojiPicker(): void {
        this.messageInput.nativeElement.togglePopup();
    }

    public sendMessage(): void {
        const m = {
            fromMe: true,
            text: this.messageInput.nativeElement.text,
            date: new Date(),
            sender: this.me,
            status: MessageStatus.Waiting,
        } as any;
        this._messages.push(m);
        this.messageSent.emit(m);
        this.messageInput.nativeElement.text = "";
    }

    public lastMessageSentSuccessfully(id: number): void {
        this._messages[this._messages.length - 1].id = id;
        this._messages[this._messages.length - 1].status = MessageStatus.Sent;
    }
}
