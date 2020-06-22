import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class FastTranslateService {
    constructor(private translateService: TranslateService) { }

    public async t(key: string): Promise<string | {[key: string]: string}> {
        return this.translateService.get(key).toPromise();
    }
}
