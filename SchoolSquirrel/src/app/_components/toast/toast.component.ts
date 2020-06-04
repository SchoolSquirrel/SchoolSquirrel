import { Component, TemplateRef } from "@angular/core";
import { ToastService } from "../../_services/toast.service";

@Component({
    selector: "app-toasts",
    templateUrl: "./toast.component.html",
    styleUrls: ["./toast.component.scss"],
    host: { "[class.ngb-toasts]": "true" },
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }

    public isTemplate(toast: { textOrTpl: any; [key: string]: any}): boolean {
        return toast.textOrTpl instanceof TemplateRef;
    }
}
