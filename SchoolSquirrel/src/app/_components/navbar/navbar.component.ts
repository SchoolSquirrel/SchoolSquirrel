import { Component } from "@angular/core";
import { debounceTime, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { NavbarAction } from "../../_services/NavbarAction";
import { NavbarActionsService } from "../../_services/navbar-actions.service";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    public actionValue = "";
    public inputFocused = false;
    public typeaheadWidth: number;

    constructor(
        public authenticationService: AuthenticationService,
        private navbarActionsService: NavbarActionsService,
        private router: Router,
    ) {
        this.action = this.action.bind(this);
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
            this.router.navigate(["/", action._baseRoute, action.navigateTo]);
        }
        if (action.onClick) {
            action._component[action.onClick]();
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
        return (term === ""
            ? this.navbarActionsService.getNavbarActions()
            : this.navbarActionsService.getNavbarActions().filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ));
    }
}
