import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { RemoteService } from "../../_services/remote.service";
import { NoErrorToastHttpParams } from "../../_helpers/noErrorToastHttpParams";
import { AuthenticationService } from "../../_services/authentication.service";
import { ConfigService } from "../../_services/config.service";
import { ToastService } from "../../_services/toast.service";
import { StorageService } from "../../_services/storage.service";
import { isElectron } from "../../_helpers/isElectron";

export class LoginComponentCommon {
    public loginForm: FormGroup;
    public changePasswordForm: FormGroup;
    public submitted = false;
    public loading = false;
    public readonly autoDetectDomain = !isElectron();
    public tryingToAutoLogin = false;
    public changePassword = false;

    constructor(
        private httpClient: HttpClient,
        private toastService: ToastService,
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private storageService: StorageService,
        private route: ActivatedRoute,
        private configService: ConfigService,
    ) {
        this.loginForm = new FormGroup({
            domain: new FormControl("", [Validators.required, Validators.pattern(/((?:[0-9]{1,3}\.){3}[0-9]{1,3})|((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))|http(s)?:\/\/localhost/)]),
            name: new FormControl("", [Validators.required]),
            password: new FormControl("", [Validators.required]),
            rememberMe: new FormControl(true),
        });
        this.changePasswordForm = new FormGroup({
            password: new FormControl("", [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(25),
                Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
            ]),
            password2: new FormControl("", [
                Validators.required,
                () => this.passwordsMatch(),
            ]),
        });
        if (this.autoDetectDomain) {
            const url = typeof window !== "undefined" ? window.location.toString() : "";
            if (url.indexOf("localhost:4200") !== -1) { // is dev
                const apiPortDev = 3000;
                this.loginForm.controls.domain.setValue(`http://localhost:${apiPortDev}`);
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

    public onChangePasswordSubmit(): void {
        this.toastService.removeAll();
        this.submitted = true;
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.remoteService.post("auth/password", { password: this.changePasswordForm.controls.password.value }).subscribe((d) => {
            if (d.success) {
                this.loggedInSuccessfully();
            }
        });
    }

    public passwordsMatch(): null | Record<string, boolean> {
        if (this.changePasswordForm) {
            const pass = this.changePasswordForm.controls.password.value;
            const confirmPass = this.changePasswordForm.controls.password2.value;
            return pass === confirmPass ? null : { notMatching: true };
        }
        return null;
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
                this.configService.setConfig(data);
                const apiUrl = `${this.loginForm.controls.domain.value}${data.apiUrl}`;
                this.storageService.set("apiUrl", apiUrl);
                this.remoteService.setApiUrl(apiUrl);
                this.authenticationService.login(
                    this.loginForm.controls.name.value,
                    this.loginForm.controls.password.value,
                    this.loginForm.controls.rememberMe.value,
                ).subscribe((d: any) => {
                    this.submitted = false;
                    if (d.changePassword) {
                        this.changePassword = true;
                    } else {
                        this.loggedInSuccessfully();
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

    private loggedInSuccessfully() {
        this.loading = false;
        if (this.route.snapshot.queryParams.returnUrl) {
            this.router.navigate([this.route.snapshot.queryParams.returnUrl]);
        } else {
            this.router.navigate(["home"]);
        }
    }
}
