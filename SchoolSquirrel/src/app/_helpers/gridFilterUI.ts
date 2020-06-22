import {
    IFilterUI, Column, GridComponent, IEditCell,
} from "@syncfusion/ej2-angular-grids";
import { createElement } from "@syncfusion/ej2-base";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { Query, DataManager } from "@syncfusion/ej2-data";

type Item = { name: string, value: any };

export function getDropdownFilterParams(
    items: Item[], column: string, getGrid: () => GridComponent,
): IFilterUI {
    return {
        create: () => createElement("input", { className: "flm-input" }),
        write: (args: { element: Element, column: Column }) => {
            const newItems = [...items];
            newItems.splice(0, 0, { name: "Alle", value: "all" }); // for clear filtering
            const dropInstance: DropDownList = new DropDownList({
                dataSource: new DataManager(newItems),
                fields: { text: "name" },
                index: 0,
                change: (e: any) => {
                    if (e.itemData.value !== "all") {
                        getGrid().filterByColumn(column, "equal", e.itemData.value);
                    } else {
                        getGrid().removeFilteredColsByField(column);
                    }
                },
            });
            dropInstance.appendTo(args.element as HTMLTableCellElement);
        },
    };
}

export function getDropdownEditParams(items: Item[]): IEditCell {
    return {
        params: {
            allowFiltering: true,
            dataSource: new DataManager(items),
            fields: { text: "name", value: "value" },
            query: new Query(),
            actionComplete: (): false => false,
        },
    };
}

/*

import {
    IFilterUI, Column, GridComponent, IEditCell,
} from "@syncfusion/ej2-angular-grids";
import { createElement } from "@syncfusion/ej2-base";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { Query, DataManager } from "@syncfusion/ej2-data";

type Item = { name: string, value: any };

function isFunction(functionToCheck): boolean {
    return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
}

export function getDropdownFilterParams(
    items: (Item[] | (() => Item[])), column: string, getGrid: () => GridComponent,
): IFilterUI {
    return {
        create: () => createElement("input", { className: "flm-input" }),
        write: (args: { element: Element, column: Column }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const newItems = isFunction(items) ? [...(items())] : [...items];
            newItems.splice(0, 0, { name: "Alle", value: "all" }); // for clear filtering
            const dropInstance: DropDownList = new DropDownList({
                dataSource: new DataManager(newItems),
                fields: { text: "name" },
                index: 0,
                change: (e: any) => {
                    if (e.itemData.value !== "all") {
                        getGrid().filterByColumn(column, "equal", e.itemData.value);
                    } else {
                        getGrid().removeFilteredColsByField(column);
                    }
                },
            });
            dropInstance.appendTo(args.element as HTMLTableCellElement);
        },
    };
}

export function getDropdownEditParams(items: (Item[] | (() => Item[]))): IEditCell {
    return {
        params: {
            allowFiltering: true,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dataSource: new DataManager(isFunction(items) ? items() : items),
            fields: { text: "name", value: "value" },
            query: new Query(),
            actionComplete: (): false => false,
        },
    };
}

*/
