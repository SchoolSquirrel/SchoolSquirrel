import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public get(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }
}
