import { Component } from "@angular/core";
import { NavbarActions } from "../../_decorators/navbar-actions.decorator";

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
}
