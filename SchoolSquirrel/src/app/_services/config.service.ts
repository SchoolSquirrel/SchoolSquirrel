import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

type Config = Record<string, unknown>;

@Injectable({
    providedIn: "root",
})
export class ConfigService {
    private _config: Config = {};
    constructor(private storageService: StorageService) {
        this._config = this.storageService.get("config");
    }
    public get config(): Config {
        return this._config;
    }
    public setConfig(config: Config): void {
        this._config = config;
        this.storageService.set("config", this._config);
    }
}
