import { Injectable } from "@angular/core";

type Config = Record<string, unknown>;

@Injectable({
    providedIn: "root",
})
export class ConfigService {
    private _config: Config = {};
    constructor() {
        this._config = JSON.parse(localStorage.getItem("config") || "{}");
    }
    public get config(): Config {
        return this._config;
    }
    public setConfig(config: Config): void {
        this._config = config;
        localStorage.setItem("config", JSON.stringify(this._config));
    }
}
