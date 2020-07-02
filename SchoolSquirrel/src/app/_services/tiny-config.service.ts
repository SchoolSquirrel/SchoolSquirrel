import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class TinyConfigService {
    public getConfig(placeholder: string): any {
        return {
            base_url: "/tinymce",
            suffix: ".min",
            menubar: false,
            statusbar: false,
            toolbar: "undo redo | styleselect | forecolor backcolor | bold italic underline | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link table",
            placeholder,
            language: "de",
            plugins: "autolink lists advlist table link paste searchreplace",
        };
    }
}
