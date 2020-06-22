import {
    Component, ViewChild, ElementRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { startWith, map } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
    selector: "app-select-users",
    templateUrl: "./select-users.component.html",
    styleUrls: ["./select-users.component.css"],
})
export class SelectUsersComponent {
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = ["Lemon"];
    allFruits: string[] = ["Apple", "Lemon", "Lime", "Orange", "Strawberry"];

    @ViewChild("fruitInput") fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild("auto") matAutocomplete: MatAutocomplete;

    constructor() {
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
        );
    }

    add(event: MatChipInputEvent): void {
        const { input } = event;
        const { value } = event;

        // Add our fruit
        if ((value || "").trim()) {
            this.fruits.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }

        this.fruitCtrl.setValue(null);
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = "";
        this.fruitCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter((fruit) => fruit.toLowerCase().indexOf(filterValue) === 0);
    }
}
