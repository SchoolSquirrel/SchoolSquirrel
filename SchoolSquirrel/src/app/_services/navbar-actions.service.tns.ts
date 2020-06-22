import { Injectable } from "@angular/core";
import { NavbarAction } from "./NavbarAction";

@Injectable({
    providedIn: "root",
})
export class NavbarActionsService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static addActions(route: string, ...actions: NavbarAction[]): void {
        //
    }

    public getNavbarActions(): NavbarAction[] {
        return [];
    }
}
