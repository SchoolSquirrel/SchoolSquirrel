import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import * as sanitizeHtml from "sanitize-html";

@Pipe({
    name: "safeUserHtml",
})
export class SafeUserHtmlPipe implements PipeTransform {
    private goodAttributes = ["style", "border"];
    private options: any = {
        allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "span", "a", "ul", "ol",
            "li", "b", "i", "strong", "em", "strike", "abbr", "code", "hr", "br", "div",
            "table", "thead", "caption", "tbody", "tr", "th", "td", "pre"],
        disallowedTagsMode: "discard",
        allowedAttributes: {
            a: ["href", "title", "target"],
            p: this.goodAttributes,
            span: this.goodAttributes,
            em: this.goodAttributes,
            table: this.goodAttributes,
            strong: this.goodAttributes,
        },
        selfClosing: ["br", "hr"],
        allowedSchemes: ["http", "https", "mailto"],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
        allowProtocolRelative: true,
        enforceHtmlBoundary: false,
    };
    constructor(protected sanitizer: DomSanitizer) {}

    public transform(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(sanitizeHtml(value, this.options));
    }
}
