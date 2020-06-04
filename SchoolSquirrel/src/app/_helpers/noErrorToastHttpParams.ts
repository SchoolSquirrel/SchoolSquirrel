import { HttpParams } from "@angular/common/http";

export class NoErrorToastHttpParams extends HttpParams {
    constructor(public dontShowToast: boolean) {
        super();
    }
}
