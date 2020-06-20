import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { NoErrorToastHttpParams } from "../../_helpers/noErrorToastHttpParams";
import { AuthenticationService } from "../../_services/authentication.service";
import { ToastService } from "../../_services/toast.service";
import { StorageService } from "../../_services/storage.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    public loginForm: FormGroup;
    public submitted = false;
    public loading = false;
    public readonly autoDetectDomain = true; // toDo: for Electron this needs to be false
    public tryingToAutoLogin = false;

    constructor(
        private httpClient: HttpClient,
        private toastService: ToastService,
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private storageService: StorageService,
        private route: ActivatedRoute,
    ) {
        this.loginForm = new FormGroup({
            domain: new FormControl("", [Validators.required, Validators.pattern(/((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))|http(s)?:\/\/localhost/)]),
            name: new FormControl("", [Validators.required]),
            password: new FormControl("", [Validators.required]),
            rememberMe: new FormControl(true),
        });
        if (this.autoDetectDomain) {
            const url = typeof window !== "undefined" ? window.location.toString() : "";
            if (url.indexOf("localhost:4200") !== -1) { // is dev
                this.loginForm.controls.domain.setValue("http://localhost:3000");
            } else {
                this.loginForm.controls.domain.setValue(url.substring(0, url.indexOf("/login")));
            }
            this.remoteService.setApiUrl(this.loginForm.controls.domain.value);
        }
        const jwtToken = this.storageService.get("jwtToken");
        const apiUrl = this.storageService.get("apiUrl");
        if (jwtToken && apiUrl) {
            this.tryingToAutoLogin = true;
            this.remoteService.setApiUrl(apiUrl);
            this.authenticationService.autoLogin(jwtToken).subscribe((success) => {
                if (success) {
                    if (this.route.snapshot.queryParams.returnUrl) {
                        this.router.navigate([this.route.snapshot.queryParams.returnUrl]);
                    } else {
                        this.router.navigate(["home"]);
                    }
                }
                this.tryingToAutoLogin = false;
            });
        }
    }

    public onSubmit(): void {
        this.toastService.removeAll();
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.httpClient.get(`${this.loginForm.controls.domain.value}/config.json`, { params: new NoErrorToastHttpParams(true) }).subscribe((data: any) => {
            this.loading = false;
            if (data && data.apiUrl) {
                const apiUrl = new URL(data.apiUrl, this.loginForm.controls.domain.value)
                    .toString();
                this.storageService.set("apiUrl", apiUrl);
                this.remoteService.setApiUrl(apiUrl);
                this.authenticationService.login(
                    this.loginForm.controls.name.value,
                    this.loginForm.controls.password.value,
                    this.loginForm.controls.rememberMe.value,
                ).subscribe(() => {
                    this.loading = false;
                    if (this.route.snapshot.queryParams.returnUrl) {
                        this.router.navigate([this.route.snapshot.queryParams.returnUrl]);
                    } else {
                        this.router.navigate(["home"]);
                    }
                });
            } else {
                this.loading = false;
                this.toastService.error("Fehlerhafte config!");
            }
        }, () => {
            this.loading = false;
            this.toastService.error("Falsche Domain!");
        });
    }
}
