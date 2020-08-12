import { Injectable } from "@angular/core";
import { FastTranslateService } from "./fast-translate.service";
import { isElectron } from "../_helpers/isElectron";

@Injectable({
    providedIn: "root",
})
export class ElectronService {
    public readonly isElectron: boolean = isElectron();
    public remote: any;
    public electron: any;
    constructor(private fts: FastTranslateService) {
        if (this.isElectron) {
            this.electron = (window as any).require("electron");
            this.remote = this.electron.remote;
            setTimeout(async () => {
                const cw = this.remote.getCurrentWindow();
                const tray = new this.remote.Tray("src/assets/logo.png");
                tray.setContextMenu(this.remote.Menu.buildFromTemplate([
                    {
                        label: await this.fts.t("general.open"),
                        click() {
                            cw.show();
                        },
                    },
                    {
                        label: await this.fts.t("general.quit"),
                        click() {
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
