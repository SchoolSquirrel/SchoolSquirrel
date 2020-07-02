import { Component, ViewChild } from "@angular/core";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { EventSettingsModel, ScheduleComponent } from "@syncfusion/ej2-angular-schedule";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "../../_services/remote.service";
import { SchedulerEvent } from "../../_models/SchedulerEvent";

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
    public eventSettings: any = {};
    public loading = true;
    @ViewChild("calendar") public calendar: ScheduleComponent;
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public onChange(ev: any): void {
        if (ev) {
            switch (ev.requestType) {
            case "eventCreated":
                this.remoteService.post("events", {
                    Description: ev.data[0].Description ? ev.data[0].Description : "",
                    EndTime: ev.data[0].EndTime.toISOString(),
                    Subject: ev.data[0].Subject ? ev.data[0].Subject : "Unnamed",
                    Location: ev.data[0].Location ? ev.data[0].Location : "",
                    StartTime: ev.data[0].StartTime.toISOString(),
                    IsAllDay: ev.data[0].IsAllDay,
                    RecurrenceRule: ev.data[0].RecurrenceRule,
                    EndTimezone: ev.data[0].EndTimezone,
                    StartTimezone: ev.data[0].StartTimezone,
                } as SchedulerEvent).subscribe((events) => {
                    this.eventSettings.dataSource = events;
                    this.refreshSchedule();
                });
                break;
            case "eventChanged":
                this.remoteService.post(`events/${ev.data.Id}`, {
                    Description: ev.data.Description ? ev.data.Description : "",
                    EndTime: ev.data.EndTime.toISOString(),
                    Subject: ev.data.Subject ? ev.data.Subject : "Unnamed",
                    Location: ev.data.Location ? ev.data.Location : "",
                    StartTime: ev.data.StartTime.toISOString(),
                    IsAllDay: ev.data.IsAllDay,
                    RecurrenceRule: ev.data.RecurrenceRule,
                    EndTimezone: ev.data.EndTimezone,
                    StartTimezone: ev.data.StartTimezone,
                } as SchedulerEvent).subscribe();
                break;
            case "eventRemoved":
                if (!(ev && ev.data && ev.data[0] && ev.data[0].Id)) {
                    return;
                }
                this.remoteService.delete(`events/${ev.data[0].Id}`).subscribe(() => {
                    this.eventSettings.dataSource = this.eventSettings
                        .dataSource.filter((e: { Id: any; }) => e.Id != ev.data[0].Id);
                    this.refreshSchedule();
                });
                break;
            default:
                // eslint-disable-next-line no-console
                // console.log(ev);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public onEventRendered(args: any) {
        args.element.style.backgroundColor = args.data.Color;
    }

    private refreshSchedule() {
        (document.querySelector("ejs-schedule") as any).ej2_instances[0].eventSettings.dataSource = this.eventSettings.dataSource;
    }
}
