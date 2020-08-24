import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { FastTranslateService } from "./fast-translate.service";
import { isElectron } from "../_helpers/isElectron";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: "root",
})
export class ElectronService {
    public readonly isElectron: boolean = isElectron();
    public remote: any;
    public electron: any;
    constructor(
        private fts: FastTranslateService,
        private zone: NgZone,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
        if (this.isElectron) {
            this.electron = (window as any).require("electron");
            this.remote = this.electron.remote;
            setTimeout(async () => {
                const cw = this.remote.getCurrentWindow();
                const tray = new this.remote.Tray("src/assets/logo.png");
                const modules = ["chat", "calendar", "courses", "assignments"];
                const moduleNames = [];
                for (const m of modules) {
                    moduleNames.push(await this.fts.t(`general.${m}`));
                }
                tray.setContextMenu(this.remote.Menu.buildFromTemplate([
                    ...modules.map((m, idx) => ({
                        label: moduleNames[idx],
                        click: () => {
                            this.zone.run(() => {
                                this.router.navigate([`/${m}`]);
                            });
                        },
                    })),
                    {
                        type: "separator",
                    },
                    {
                        label: await this.fts.t("general.logout"),
                        click: () => {
                            this.zone.run(() => {
                                authenticationService.logout();
                            });
                        },
                    },
                    {
                        label: await this.fts.t("general.settings"),
                        click: () => {
                            this.zone.run(() => {
                                this.router.navigate(["/settings"]);
                            });
                        },
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: await this.fts.t("general.open"),
                        click: () => {
                            cw.show();
                        },
                    },
                    {
                        label: await this.fts.t("general.quit"),
                        click: () => {
                            (window as any).require("electron").remote.app.quit();
                        },
                    },
                ]));
                tray.on("click", () => {
                    cw.show();
                    cw.focus();
                });
            });
        }
    }

    public runIfElectron(f: (remote, currentWindow) => void): void {
        if (this.isElectron) {
            f(this.remote, this.remote.getCurrentWindow());
        }
    }

    public setTitle(t: string): void {
        this.runIfElectron((_remote, currentWindow) => {
            currentWindow.setTitle(`${t} | SchoolSquirrel`);
        });
    }
}
