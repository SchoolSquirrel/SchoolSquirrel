import {
    HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "../_services/authentication.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.currentUser) {
            const authReq = req.clone({
                headers: new HttpHeaders({
                    authorization: this.authenticationService.currentUser?.jwtToken,
                }),
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}
