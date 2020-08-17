import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Page } from "@nativescript/core";
import { LoginComponentCommon } from "./login.component.common";
import { ToastService } from "../../_services/toast.service";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { StorageService } from "../../_services/storage.service";
import { ConfigService } from "../../_services/config.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends LoginComponentCommon {
    constructor(
        httpClient: HttpClient,
        toastService: ToastService,
        remoteService: RemoteService,
        authenticationService: AuthenticationService,
        router: Router,
        storageService: StorageService,
        route: ActivatedRoute,
        configService: ConfigService,
        private page: Page,
    ) {
        super(httpClient, toastService, remoteService,
            authenticationService, router, storageService, route, configService);
    }
}
