import {
    Component, Input, Output, EventEmitter,
} from "@angular/core";
import { User } from "../../_models/User";

@Component({
    selector: "app-user-chip",
    templateUrl: "./user-chip.component.html",
    styleUrls: ["./user-chip.component.scss"],
})
export class UserChipComponent {
    @Input() public user: User;
    @Input() public showTimes = false;
    @Output() public removed: EventEmitter<void> = new EventEmitter<void>();
}
