import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "../../_services/remote.service";
import { EventCategory } from "../../_models/EventCategory";

export class CalendarComponentCommon {
    public loading = true;
    public categoryColors = {
        [EventCategory.Assignment]: "#27ae60",
        [EventCategory.UserEvent]: "#3498db",
        [EventCategory.Holiday]: "#f39c12",
        [EventCategory.Vacation]: "#f39c12",
        [EventCategory.Conference]: "#8e44ad",
        default: "#2c3e50",
    };
    public selectedCategories: string[] = [...Object.keys(EventCategory), "default"];
    constructor(public fts: FastTranslateService, public remoteService: RemoteService) {
    }

    public isSelected(category: string): boolean {
        const index = this.selectedCategories.indexOf(category);
        return index >= 0;
    }

    public toggleCategory(category: string): void {
        const index = this.selectedCategories.indexOf(category);
        if (index >= 0) {
            this.selectedCategories.splice(index, 1);
        } else {
            this.selectedCategories.push(category);
        }
        this.filterEvents();
    }

    public filterEvents(): void {
        //
    }
}
