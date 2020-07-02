import { Pipe, PipeTransform } from "@angular/core";
import * as sanitizeHtml from "sanitize-html";

@Pipe({
    name: "htmlToText",
})
export class HtmlToTextPipe implements PipeTransform {
    private options: any = {
        allowedTags: [],
        disallowedTagsMode: "discard",
        allowedAttributes: {},
        selfClosing: [],
        allowedSchemes: [],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: [],
        allowProtocolRelative: true,
        enforceHtmlBoundary: false,
    };

    public transform(value: string): string {
        return sanitizeHtml(value, this.options);
    }
}
