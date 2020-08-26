import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { StorageService } from "./storage.service";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: "root",
})
export class RemoteService {
    private pApiUrl = "";
    constructor(private httpClient: HttpClient, private storageService: StorageService) {
        this.pApiUrl = this.storageService.get("apiUrl");
    }

    public setApiUrl(url: string): void {
        this.pApiUrl = url;
    }

    public get apiUrl(): string {
        return this.pApiUrl;
    }

    public getImageUrl(url: string, authService: AuthenticationService): string {
        return `${this.pApiUrl}/${url}?authorization=${authService.currentUser?.jwtToken}`;
    }

    public get(url: string): Observable<any> {
        if (!this.pApiUrl) {
            return new Subject();
        }
        return this.httpClient.get(`${this.pApiUrl}/${url}`);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public post(url: string, data: { [key: string]: any }, options?: any): Observable<any> {
        return this.httpClient.post(`${this.pApiUrl}/${url}`, data, options);
    }

    public postFile(
        url: string, data: { [key: string]: any }, fileKey: string, file: File,
        observeEvents = false,
    ): Observable<any> {
        const formData = new FormData();
        formData.append(fileKey, file, file.name);
        for (const key of Object.keys(data)) {
            formData.append(key, data[key]);
        }
        return this.httpClient.post(`${this.pApiUrl}/${url}`, formData, { reportProgress: true, observe: observeEvents ? "events" : undefined });
    }

    public delete(url: string): Observable<any> {
        return this.httpClient.delete(`${this.pApiUrl}/${url}`);
    }
}
