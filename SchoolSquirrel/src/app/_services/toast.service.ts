import { Injectable, TemplateRef } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ToastService {
    public toasts: any[] = [];

    public custom(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
        if (!options.classname) {
            options.classname = "bg-success";
        }
        this.toasts.push({ textOrTpl, ...options });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public remove(toast: any) {
        this.toasts = this.toasts.filter((t) => t !== toast);
    }

    public removeAll(): void {
        this.toasts = [];
    }

    public success(msg: string) : void {
        this.custom(msg, { classname: "bg-success text-white", headerText: "Erfolg!" });
    }
    public error(msg: string) : void {
        this.custom(msg, { classname: "bg-danger text-white", headerText: "Fehler!" });
    }
}
