import { Component } from "@angular/core";

@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
    title = 'Calendar'; // needed for AoT since you're binding to it in {N} view
}
