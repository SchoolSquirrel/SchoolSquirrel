import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class RemoteService {
    private apiUrl = localStorage.getItem("apiUrl");
    constructor(private httpClient: HttpClient) { }

    public setApiUrl(url: string): void {
        this.apiUrl = url;
    }

    public get(url: string): Observable<any> {
        return this.httpClient.get(`${this.apiUrl}/${url}`);
    }

    public post(url: string, data: {[key: string]: any}): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/${url}`, data);
    }

    public delete(url: string): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}/${url}`);
    }
}
