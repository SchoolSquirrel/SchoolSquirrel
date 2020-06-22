import { Component } from "@angular/core";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { FastTranslateService } from "../../_services/fast-translate.service";

@NavbarActions([
    {
        name: "Calendar",
        description: "Open the calendar",
        navigate: true,
    },
    {
        name: "New event",
        description: "Create a new event",
        navigate: true,
    },
], "calendar")
@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
    public weekFirstDay = 1;
    constructor(private fts: FastTranslateService) {
        setCulture("de");
        (async () => {
            L10n.load({
                de: await this.fts.t("libraries"),
            });
        })();
    }
}
