import {
    Component, Input, Output, EventEmitter,
} from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    @Input() public title: string;
    @Input() public isModal: boolean;
    @Output() public back: EventEmitter<void> = new EventEmitter<void>();

    public openSideDrawer(): void {
        (Application.getRootView() as any as RadSideDrawer).showDrawer();
    }

    public goBack(): void {
        this.back.emit();
    }
}
