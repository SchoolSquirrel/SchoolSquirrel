import { NavbarActionsService } from "../_services/navbar-actions.service";
import { NavbarAction } from "../_services/NavbarAction";

export function NavbarActions(actions: NavbarAction[], route?: string) {
    // eslint-disable-next-line
    return (component: any, ..._args: any[]): void => {
        NavbarActionsService.addActions(component, route, ...actions);
    };
}
