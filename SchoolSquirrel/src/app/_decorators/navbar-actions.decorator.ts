import { NavbarActionsService, NavbarAction } from "../_services/navbar-actions.service";

export function NavbarActions(actions: NavbarAction[], route?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (..._args: any[]): void => {
        NavbarActionsService.addActions(route, ...actions);
    };
}
