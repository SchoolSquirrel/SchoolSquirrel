import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { User } from "../_models/User";
import { RemoteService } from "./remote.service";
import { StorageService } from "./storage.service";
import { NoErrorToastHttpParams } from "../_helpers/noErrorToastHttpParams";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
    public currentUser: User;

    constructor(private remoteService: RemoteService, private storageService: StorageService) { }

    public login(username: string, password: string): Observable<User> {
        return this.remoteService.post("auth/login", { password, username }).pipe(
            map((user: User) => {
                // login successful if there's a jwt token in the response
                this.loggedIn(user);
                return user;
            }),
        );
    }

    private loggedIn(user: User) {
        if (user) {
            this.currentUser = user;
            this.storageService.set("jwtToken", user.jwtToken);
        }
    }

    public autoLogin(jwtToken: string): Subject<any> {
        const o = new Subject();
        this.remoteService.post("auth/renewToken", { jwtToken }, { params: new NoErrorToastHttpParams(true) }).subscribe((data) => {
            if (data && data.user) {
                this.loggedIn(data.user);
                o.next(true);
            } else {
                o.next(false);
            }
        }, () => {
            o.next(false);
        });
        return o;
    }

    public logout(): void {
        // ToDo
    }
}
