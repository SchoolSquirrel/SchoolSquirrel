import { Injectable } from "@angular/core";
import { NavbarAction } from "./NavbarAction";

(window as any).actions = [];

@Injectable({
    providedIn: "root",
})
export class NavbarActionsService {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static addActions(component: any, route: string, ...actions: NavbarAction[]): void {
        for (const action of actions) {
            action._baseRoute = route;
            action._component = component;
            (window as any).actions.push(action);
        }
    }

    public getNavbarActions(): NavbarAction[] {
        return (window as any).actions;
    }
}
