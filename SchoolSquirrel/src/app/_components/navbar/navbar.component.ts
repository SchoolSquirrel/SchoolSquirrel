import { Component } from "@angular/core";
import { debounceTime, map } from "rxjs/operators";
import { Observable } from "rxjs";
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

    constructor(
        public authenticationService: AuthenticationService,
        private navbarActionsService: NavbarActionsService,
    ) {
        this.action = this.action.bind(this);
    }

    public openTypeahead(element: HTMLInputElement): void {
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

    public search(term: string): any[] {
        return (term === ""
            ? this.navbarActionsService.getNavbarActions()
            : this.navbarActionsService.getNavbarActions().filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ));
    }
}
