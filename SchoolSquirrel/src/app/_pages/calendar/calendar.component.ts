import { Component } from "@angular/core";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { EventSettingsModel } from "@syncfusion/ej2-angular-schedule";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "@src/app/_services/remote.service";

@NavbarActions([
    {
        name: "Calendar",
        description: "Open the calendar",
    },
    {
        name: "New event",
        description: "Create a new event",
        navigateTo: "new",
    },
], "calendar")
@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
    public weekFirstDay = 1;
    public eventSettings: EventSettingsModel = {};
    public loading = true;
    constructor(private fts: FastTranslateService, private remoteService: RemoteService) {
        setCulture("de");
        (async () => {
            L10n.load({
                de: await this.fts.t("libraries"),
            });
        })();
    }

    public ngOnInit(): void {
        this.remoteService.get("events").subscribe((data) => {
            this.eventSettings.dataSource = data;
            this.loading = false;
        });
    }

    public newEvent(): void {
        //
    }
}
