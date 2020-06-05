import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { NoErrorToastHttpParams } from "../../_helpers/noErrorToastHttpParams";
import { AuthenticationService } from "../../_services/authentication.service";
import { ToastService } from "../../_services/toast.service";

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

    constructor(
        private httpClient: HttpClient,
        private toastService: ToastService,
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {
        this.loginForm = new FormGroup({
            domain: new FormControl("", [Validators.required, Validators.pattern(/((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))|http(s)?:\/\/localhost/)]),
            name: new FormControl("", [Validators.required]),
            password: new FormControl("", [Validators.required]),
        });
        if (this.autoDetectDomain) {
            const url = window.location.toString();
            if (url.indexOf("localhost:4200") !== -1) { // is dev
                this.loginForm.controls.domain.setValue("http://localhost:3000");
            } else {
                this.loginForm.controls.domain.setValue(url.substring(0, url.indexOf("/login")));
            }
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
                localStorage.setItem("apiUrl", apiUrl);
                this.remoteService.setApiUrl(apiUrl);
                this.authenticationService.login(
                    this.loginForm.controls.name.value,
                    this.loginForm.controls.password.value,
                ).subscribe(() => {
                    this.loading = false;
                    this.router.navigate(["home"]);
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
