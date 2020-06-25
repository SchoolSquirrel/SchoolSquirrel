import { Injectable, TemplateRef } from "@angular/core";
import { Feedback } from "nativescript-feedback";

@Injectable({
    providedIn: "root",
})
export class ToastService {
    private feedback: Feedback;

    constructor() {
        this.feedback = new Feedback();
    }

    // eslint-disable-next-line
    public custom(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
        //
    }

    // eslint-disable-next-line
    public remove(toast: any) {
        //
    }

    public removeAll(): void {
        //
    }

    public success(msg: string) : void{
        this.feedback.success({
            title: "Erfolg!",
            message: msg,
        });
    }
    public error(msg: string) : void{
        this.feedback.error({
            title: "Fehler!",
            message: msg,
        });
    }
}
