import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { StorageService } from "./storage.service";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: "root",
})
export class RemoteService {
    private apiUrl = "";
    constructor(private httpClient: HttpClient, private storageService: StorageService) {
        this.storageService.get("apiUrl");
    }

    public setApiUrl(url: string): void {
        this.apiUrl = url;
    }

    public getImageUrl(url: string, authService: AuthenticationService): string {
        return `${this.apiUrl}/${url}?authorization=${authService.currentUser?.jwtToken}`;
    }

    public get(url: string): Observable<any> {
        if (!this.apiUrl) {
            return new Subject();
        }
        return this.httpClient.get(`${this.apiUrl}/${url}`);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public post(url: string, data: { [key: string]: any }, options?: any): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/${url}`, data, options);
    }

    public delete(url: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${url}`);
    }
}
