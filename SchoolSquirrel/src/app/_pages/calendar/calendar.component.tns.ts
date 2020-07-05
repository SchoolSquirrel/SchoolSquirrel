import { Component, ViewChild } from "@angular/core";
import { RadCalendarComponent } from "nativescript-ui-calendar/angular";
import { CalendarEvent, CalendarEventsViewMode } from "nativescript-ui-calendar";
import { Color } from "@nativescript/core";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "../../_services/remote.service";
import { CalendarComponentCommon } from "./calendar.component.common";
import { SchedulerEvent } from "../../_models/SchedulerEvent";

@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent extends CalendarComponentCommon {
    public weekFirstDay = 1;
    @ViewChild("calendar") public calendar: RadCalendarComponent;
    private allEvents: CalendarEvent[] = [];
    public events: CalendarEvent[] = [];
    public eventsViewMode = CalendarEventsViewMode.Inline;
    constructor(fts: FastTranslateService, remoteService: RemoteService) {
        super(fts, remoteService);
    }

    public ngOnInit(): void {
        this.remoteService.get("events").subscribe((data: SchedulerEvent[]) => {
            this.events = data.map((e) => new CalendarEvent(
                e.Subject,
                new Date(e.StartTime),
                new Date(e.EndTime),
                e.IsAllDay,
                new Color(this.categoryColors[e.Category]
                    ? this.categoryColors[e.Category]
                    : this.categoryColors.default),
            ));
            this.allEvents = [...this.events];
            this.loading = false;
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    /* public onChange(ev: any): void {
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
                if (ev.data.Category !== EventCategory.UserEvent) {
                    return;
                }
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
                if (ev.data[0].Category !== EventCategory.UserEvent) {
                    return;
                }
                this.remoteService.delete(`events/${ev.data[0].Id}`).subscribe(() => {
                    this.events = this.eventSettings
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
    } */

    private refreshSchedule() {
        //
    }

    public filterEvents(): void {
        /* this.events = this.allEvents.filter(
            (e) => this.selectedCategories.includes(e.Category),
        );
        this.refreshSchedule(); */
    }
}
