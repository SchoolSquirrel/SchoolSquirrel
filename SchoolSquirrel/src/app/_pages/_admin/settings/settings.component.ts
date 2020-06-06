import { Component } from "@angular/core";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
    title = 'Settings'; // needed for AoT since you're binding to it in {N} view
}
