import * as sanitize from "sanitize-html";

export function sanitizeHtml(value: string): string {
    const goodAttributes = ["style", "border"];
    const options: any = {
        allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "span", "a", "ul", "ol",
            "li", "b", "i", "strong", "em", "strike", "abbr", "code", "hr", "br", "div",
            "table", "thead", "caption", "tbody", "tr", "th", "td", "pre"],
        disallowedTagsMode: "discard",
        allowedAttributes: {
            a: ["href", "title", "target"],
            p: goodAttributes,
            span: goodAttributes,
            em: goodAttributes,
            table: goodAttributes,
            strong: goodAttributes,
        },
        selfClosing: ["br", "hr"],
        allowedSchemes: ["http", "https", "mailto"],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
        allowProtocolRelative: true,
        enforceHtmlBoundary: false,
    };
    return sanitize(value, options);
}