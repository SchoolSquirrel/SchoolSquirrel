import { NavbarActionsService } from "../_services/navbar-actions.service";
import { NavbarAction } from "../_services/NavbarAction";

export function NavbarActions(actions: NavbarAction[], route?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (..._args: any[]): void => {
        NavbarActionsService.addActions(route, ...actions);
    };
}
