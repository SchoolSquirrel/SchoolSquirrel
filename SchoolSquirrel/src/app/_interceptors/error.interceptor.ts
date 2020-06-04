import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { ToastService } from "../_services/toast.service";
import { NoErrorToastHttpParams } from "../_helpers/noErrorToastHttpParams";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private toastService: ToastService) {}
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = "";
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = error.error.message;
                    } else {
                        // server-side error
                        errorMessage = error.message;
                    }
                    // when using { params: new NoErrorToastHttpParams(true) }, don't show toast
                    if (!(request.params instanceof NoErrorToastHttpParams
                        && request.params.dontShowToast)) {
                        this.toastService.error(errorMessage);
                    }
                    return throwError(errorMessage);
                }),
            );
    }
}
