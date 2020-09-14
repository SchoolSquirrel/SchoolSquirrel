import {
    Component, Input, Output, EventEmitter,
} from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { NavbarActionItem } from "../../_models/NavbarActionItem";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    @Input() public title: string;
    @Input() public isModal: boolean;
    @Input() public actionItems: NavbarActionItem[] = [];
    @Output() public back: EventEmitter<void> = new EventEmitter<void>();
    @Output() public actionItemTap: EventEmitter<string> = new EventEmitter<string>();

    public openSideDrawer(): void {
        (Application.getRootView() as any as RadSideDrawer).showDrawer();
    }

    public goBack(): void {
        this.back.emit();
    }
}
