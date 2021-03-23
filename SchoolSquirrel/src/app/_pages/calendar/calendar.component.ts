import { Component, ViewChild } from "@angular/core";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { ScheduleComponent } from "@syncfusion/ej2-angular-schedule";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "../../_services/remote.service";
import { SchedulerEvent } from "../../_models/SchedulerEvent";
import { EventCategory } from "../../_models/EventCategory";
import { CalendarComponentCommon } from "./calendar.component.common";

@NavbarActions([
    {
        name: "Calendar",
        description: "Open the calendar",
    },
], "calendar")
@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent extends CalendarComponentCommon {
    public weekFirstDay = 1;
    public eventSettings: any = {};
    @ViewChild("calendar") public calendar: ScheduleComponent;
    private allEvents: SchedulerEvent[] = [];
    constructor(fts: FastTranslateService, remoteService: RemoteService) {
        super(fts, remoteService);
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
            this.allEvents = data;
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
                    this.allEvents = events;
                    this.filterEvents();
                });
                break;
            case "eventChanged":
                if (ev.data[0].Category !== EventCategory.UserEvent) {
                    return;
                }
                this.remoteService.post(`events/${ev.data[0].Id}`, {
                    Description: ev.data[0].Description ? ev.data[0].Description : "",
                    EndTime: ev.data[0].EndTime.toISOString(),
                    Subject: ev.data[0].Subject ? ev.data[0].Subject : "Unnamed",
                    Location: ev.data[0].Location ? ev.data[0].Location : "",
                    StartTime: ev.data[0].StartTime.toISOString(),
                    IsAllDay: ev.data[0].IsAllDay,
                    RecurrenceRule: ev.data[0].RecurrenceRule,
                    EndTimezone: ev.data[0].EndTimezone,
                    StartTimezone: ev.data[0].StartTimezone,
                } as SchedulerEvent).subscribe();
                break;
            case "eventRemoved":
                if (!(ev && ev.data && ev.data[0] && ev.data[0].Id)) {
                    return;
                }
                if (ev.data[0].Category !== EventCategory.UserEvent) {
                    return;
                }
                this.remoteService.delete(`events/${ev.data[0].Id}`).subscribe(() => {
                    this.eventSettings.dataSource = this.eventSettings
                        .dataSource.filter((e: { Id: any; }) => e.Id != ev.data[0].Id);
                    this.allEvents = this.allEvents
                        .filter((e: { Id: any; }) => e.Id != ev.data[0].Id);
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
        args.element.style.backgroundColor = this.categoryColors[args.data.Category]
            ? this.categoryColors[args.data.Category]
            : this.categoryColors.default;
    }

    private refreshSchedule() {
        (document.querySelector("ejs-schedule") as any).ej2_instances[0].eventSettings.dataSource = this.eventSettings.dataSource;
    }

    public filterEvents(): void {
        this.eventSettings.dataSource = this.allEvents.filter(
            (e) => this.selectedCategories.includes(e.Category),
        );
        this.refreshSchedule();
    }
}
