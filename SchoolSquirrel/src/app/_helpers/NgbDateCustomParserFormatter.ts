import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";

// eslint-disable-next-line no-restricted-globals
function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0); }

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split(".");
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { day: parseInt(dateParts[0]), month: null, year: null };
            } if (dateParts.length === 2
                && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return {
                    day: parseInt(dateParts[0]),
                    month: parseInt(dateParts[1]),
                    year: null,
                };
            } if (dateParts.length === 3 && isNumber(dateParts[0])
                && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return {
                    day: parseInt(dateParts[0]),
                    month: parseInt(dateParts[1]),
                    year: parseInt(dateParts[2]),
                };
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        return date
            ? `${isNumber(date.day) ? (date.day.toString().length == 1 ? `0${date.day.toString()}` : date.day.toString()) : ""}.${isNumber(date.month) ? (date.month.toString().length == 1 ? `0${date.month.toString()}` : date.month.toString()) : ""}.${date.year}`
            : "";
    }
}
