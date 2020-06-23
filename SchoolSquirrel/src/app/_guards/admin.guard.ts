import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";

@Injectable({
    providedIn: "root",
})
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) { }

    public canActivate(): boolean {
        if (this.authenticationService.isAdmin()) {
            return true;
        }
        // user is no admin so redirect to home page
        this.router.navigate(["/home"]);
        return false;
    }
}
