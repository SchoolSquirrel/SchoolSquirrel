import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../_models/User";
import { RemoteService } from "./remote.service";
import { StorageService } from "./storage.service";
import { NoErrorToastHttpParams } from "../_helpers/noErrorToastHttpParams";
import { NavbarActions } from "../_decorators/navbar-actions.decorator";

@NavbarActions([
    {
        name: "Logout",
        description: "Logout of SchoolSquirrel",
        onClick: "logout",
    },
])
@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
    public currentUser: User;
    public onLogin = new Subject<boolean>();

    constructor(
        private remoteService: RemoteService,
        private storageService: StorageService,
        private router: Router,
    ) { }

    public login(name: string, password: string, rememberMe: boolean): Observable<User> {
        return this.remoteService.post("auth/login", { password, name }).pipe(
            map((user: User) => {
                // login successful if there's a jwt token in the response
                this.loggedIn(user, rememberMe);
                return user;
            }),
        );
    }

    public isAdmin(): boolean {
        return this.currentUser?.role == "admin";
    }
    public isTeacher(): boolean {
        return this.isAdmin() || this.currentUser?.role == "teacher";
    }
    public isStudent(): boolean {
        return this.currentUser?.role == "student";
    }

    private loggedIn(user: User, rememberMe: boolean) {
        if (user) {
            this.currentUser = user;
            if (rememberMe) {
                this.storageService.set("jwtToken", user.jwtToken);
            }
            this.onLogin.next(true);
        }
    }

    public autoLogin(jwtToken: string): Subject<any> {
        const o = new Subject();
        this.remoteService.post("auth/renewToken", { jwtToken }, { params: new NoErrorToastHttpParams(true) }).subscribe((data) => {
            if (data && data.user) {
                this.loggedIn(data.user, true);
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
        this.storageService.remove("jwtToken");
        window.location.reload();
    }
}
