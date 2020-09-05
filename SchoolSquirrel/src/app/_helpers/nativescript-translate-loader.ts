import { TranslateLoader } from "@ngx-translate/core";
import { Observable, from } from "rxjs";
import { knownFolders } from "@nativescript/core";
import { map } from "rxjs/operators";

export class NativeScriptLoader implements TranslateLoader {
    constructor(public prefix: string = "/assets/i18n/", public suffix: string = ".json") {
    }

    public getTranslation(lang: string): Observable<any> {
        return from(knownFolders.currentApp().getFile(`${this.prefix}${lang}${this.suffix}`).readText()).pipe(
            map((data: any) => JSON.parse(data)),
        );
    }
}

export function nativescriptTranslateLoaderFactory(): NativeScriptLoader {
    return new NativeScriptLoader("./assets/i18n/", ".json");
}
