import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { isElectron } from "../../_helpers/isElectron";
import { LoginComponentCommon } from "./login.component.common";
import { ToastService } from "../../_services/toast.service";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { StorageService } from "../../_services/storage.service";
import { ElectronService } from "../../_services/electron.service";
import { ConfigService } from "../../_services/config.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends LoginComponentCommon {
    public isElectron: boolean = isElectron();
    public isMaximized = false;
    constructor(
        httpClient: HttpClient,
        toastService: ToastService,
        remoteService: RemoteService,
        authenticationService: AuthenticationService,
        router: Router,
        storageService: StorageService,
        route: ActivatedRoute,
        configService: ConfigService,
        private electronService: ElectronService,
    ) {
        super(httpClient, toastService, remoteService,
            authenticationService, router, storageService, route, configService);
    }

    public minWindow(): void {
        this.electronService.runIfElectron((_, currentWindow) => {
            currentWindow.minimize();
        });
    }

    public maxWindow(): void {
        this.isMaximized = !this.isMaximized;
        this.electronService.runIfElectron((_, currentWindow) => {
            if (currentWindow.isMaximized()) {
                currentWindow.unmaximize();
            } else {
                currentWindow.maximize();
            }
        });
    }
    public closeWindow(): void {
        this.electronService.runIfElectron((_, currentWindow) => {
            currentWindow.hide();
        });
    }
}
