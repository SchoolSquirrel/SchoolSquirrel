import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "filesize",
})
export class FilesizePipe implements PipeTransform {
    public transform(value: number): string {
        const thresh = 1000;

        if (Math.abs(value) < thresh) {
            return `${value} B`;
        }

        const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        const r = 10 ** 1;

        do {
            value /= thresh;
            ++u;
        } while (Math.round(Math.abs(value) * r) / r >= thresh && u < units.length - 1);

        return `${value.toFixed(1)} ${units[u]}`;
    }
}
