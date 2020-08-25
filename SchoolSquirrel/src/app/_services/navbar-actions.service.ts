import { Injectable, Injector } from "@angular/core";
import { NavbarAction } from "./NavbarAction";

@Injectable({
    providedIn: "root",
})
export class NavbarActionsService {
    private actions: NavbarAction[] = [];
    constructor(private injector: Injector) {}
    public async addActions(
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        component: any, actions: NavbarAction[], route?: string,
    ): Promise<void> {
        for (const action of actions) {
            action._baseRoute = route;
            action._component = component;
            this.actions.push(action);
        }
    }

    public getNavbarActions(): NavbarAction[] {
        return this.actions;
    }
}
