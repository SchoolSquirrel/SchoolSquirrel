import { NativeScriptLoader } from "@danvick/ngx-translate-nativescript-loader";

export function nativescriptTranslateLoaderFactory(): NativeScriptLoader {
    return new NativeScriptLoader("./assets/i18n/", ".json");
}
