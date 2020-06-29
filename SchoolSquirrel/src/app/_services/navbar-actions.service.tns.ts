import { Injectable } from "@angular/core";
import { NavbarAction } from "./NavbarAction";

@Injectable({
    providedIn: "root",
})
export class NavbarActionsService {
    // eslint-disable-next-line
    public static addActions(component: any, route: string, ...actions: NavbarAction[]): void {
        //
    }

    public getNavbarActions(): NavbarAction[] {
        return [];
    }
}
