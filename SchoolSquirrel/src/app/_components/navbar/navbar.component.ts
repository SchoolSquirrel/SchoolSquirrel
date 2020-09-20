import { Component, ViewChild, Injector } from "@angular/core";
import { debounceTime, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { NgbTypeaheadSelectItemEvent, NgbDropdown } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { NavbarAction } from "../../_services/NavbarAction";
import { NavbarActionsService } from "../../_services/navbar-actions.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { ElectronService } from "../../_services/electron.service";
import { isElectron } from "../../_helpers/isElectron";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    public actionValue = "";
    public inputFocused = false;
    public typeaheadWidth: number;
    public isMaximized = false;
    public isElectron = isElectron();
    @ViewChild(NgbDropdown) public dropdownElement: NgbDropdown;

    constructor(
        public authenticationService: AuthenticationService,
        private navbarActionsService: NavbarActionsService,
        private router: Router,
        private electronService: ElectronService,
        private injector: Injector,
    ) {
        this.action = this.action.bind(this);
    }

    public setDropDownOpenState(isOpen: boolean): void {
        if (isOpen) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.dropdownElement._menu.nativeElement.parentElement.classList.add("settings-dropdown");
        }
    }

    public openTypeahead(element: HTMLInputElement): void {
        this.typeaheadWidth = element.getBoundingClientRect().width - 18;
        element.value = "";
        element.dispatchEvent(new Event("input"));
        element.focus();
    }

    public action(inputText: Observable<string>): any {
        return inputText.pipe(
            debounceTime(200),
            map((term) => this.search(term).slice(0, 10)),
        );
    }

    public itemSelected(event: NgbTypeaheadSelectItemEvent): void {
        const action: NavbarAction = event.item;
        if (action.navigateTo) {
            this.router.navigate(["/", action._baseRoute, ...action.navigateTo.split("/")]);
        }
        if (action.onClick) {
            this.injector.get(action._component)[action.onClick]();
        }
        if (!action.onClick && !action.navigateTo) {
            this.router.navigate(["/", action._baseRoute]);
        }
        event.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        document.activeElement.blur();
        this.actionValue = "";
    }

    public search(term: string): any[] {
        if (term === "") {
            return [];
        }
        if (term.startsWith("/")) {
            const actions = this.navbarActionsService.getNavbarActions().filter((a) => !a.isUser);
            if (term === "/") {
                return actions;
            }
            return actions.filter(
                (a) => a.name.toLowerCase().indexOf(term.substr(1).toLowerCase()) > -1,
            );
        }
        if (term.startsWith("@")) {
            const actions = this.navbarActionsService.getNavbarActions().filter((a) => a.isUser);
            if (term === "@") {
                return actions;
            }
            return actions.filter(
                (a) => a.name.toLowerCase().indexOf(term.substr(1).toLowerCase()) > -1,
            );
        }
        return this.navbarActionsService.getNavbarActions().filter(
            (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
        );
    }

    public removeSpecialChars(t: string): string {
        if (t.startsWith("/") || t.startsWith("@")) {
            return t.substr(1);
        }
        return t;
    }

    public minWindow(): void {
        this.electronService.runIfElectron((_, currentWindow) => {
            currentWindow.minimize();
        });
    }

    public maxWindow(): void {
        this.isMaximized = !this.isMaximized;
        this.electronService.runIfElectron((_, currentWindow) => {
            if (currentWindow.isMaximized()) {
                currentWindow.unmaximize();
            } else {
                currentWindow.maximize();
            }
        });
    }
    public closeWindow(): void {
        this.electronService.runIfElectron((_, currentWindow) => {
            currentWindow.hide();
        });
    }
}
