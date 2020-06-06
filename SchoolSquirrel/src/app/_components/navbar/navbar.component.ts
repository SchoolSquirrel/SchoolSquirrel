import { Component } from "@angular/core";
import { debounceTime, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthenticationService } from "../../_services/authentication.service";

const actions: {
    name: string;
    description: string;
}[] = [
    {
        name: "Call...",
        description: "Call a user",
    },
    {
        name: "Offline",
        description: "Set your status to offline",
    },
    {
        name: "Online",
        description: "Set your status to online",
    },
];

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    public actionValue = "";
    public inputFocused = false;

    constructor(public authenticationService: AuthenticationService) {}

    public openTypeahead(element: HTMLInputElement): void {
        element.value = "";
        element.dispatchEvent(new Event("input"));
        element.focus();
    }

    public action(text$: Observable<string>): Observable<any[]> {
        return text$.pipe(
            debounceTime(200),
            map((term) => (term === ""
                ? actions
                : actions.filter(
                    (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
                ).slice(0, 10))),
        );
    }
}
