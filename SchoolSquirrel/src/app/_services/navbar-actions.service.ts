import { Injectable } from "@angular/core";

export type NavbarAction = {
    name: string;
    description: string;
    onClick: string;
    navigate?: boolean;
} | {
    name: string;
    description: string;
    navigate: true;
}

(window as any).actions = [];

@Injectable({
    providedIn: "root",
})
export class NavbarActionsService {
    public static addActions(route: string, ...actions: NavbarAction[]): void {
        (window as any).actions.push(...actions);
    }

    public getNavbarActions(): NavbarAction[] {
        return (window as any).actions;
    }
}
