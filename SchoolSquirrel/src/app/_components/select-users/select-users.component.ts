import {
    Component, ViewChild, ElementRef, Input, Output, EventEmitter,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { startWith, map } from "rxjs/operators";
import { User } from "../../_models/User";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-select-users",
    templateUrl: "./select-users.component.html",
    styleUrls: ["./select-users.component.css"],
})
export class SelectUsersComponent {
    public separatorKeysCodes: number[] = [];
    public userCtrl = new FormControl();
    public filteredUsers: Observable<User[]>;
    @Input() public placeholder = "";
    @Input() public users: User[] = [];
    @Output() public usersChange = new EventEmitter<User[]>();
    public allUsers: User[] = [];

    @ViewChild("userInput") userInput: ElementRef<HTMLInputElement>;
    @ViewChild("auto") matAutocomplete: MatAutocomplete;

    constructor(private remoteService: RemoteService) {
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
            startWith(null),
            map((searchTerm: string | null) => (
                searchTerm ? this._filter(searchTerm) : this.allUsers.slice())),
        );
    }

    public ngOnInit(): void {
        this.remoteService.get("users").subscribe((data) => {
            if (data) {
                this.allUsers = data;
            }
        });
    }

    public remove(user: User): void {
        const index = this.users.indexOf(user);

        if (index >= 0) {
            this.users.splice(index, 1);
        }
        this.emitNewUsers();
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.users.push(this.allUsers.filter((u) => u.username == event.option.viewValue)[0]);
        this.userInput.nativeElement.value = "";
        this.userCtrl.setValue(null);
        this.emitNewUsers();
    }

    private _filter(searchTerm: string): User[] {
        return this.allUsers.filter((u) => u.username.toLowerCase().indexOf(searchTerm) === 0);
    }

    private emitNewUsers() {
        this.usersChange.emit(this.users);
    }
}
