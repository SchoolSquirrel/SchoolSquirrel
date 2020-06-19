import { Injectable } from "@angular/core";
import * as applicationSettings from "@nativescript/core/application-settings";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public set(key: string, value: any): void {
        applicationSettings.setString(key, JSON.stringify(value));
    }

    public get(key: string): any {
        const data = applicationSettings.getString(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                //
            }
        }
        return undefined;
    }

    public remove(key: string): void {
        applicationSettings.remove(key);
    }
}
