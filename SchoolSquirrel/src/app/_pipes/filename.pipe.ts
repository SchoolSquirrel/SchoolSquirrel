import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "filename",
})
export class FilenamePipe implements PipeTransform {
    public transform(value: string): string {
        const parts = value.split("/").pop().split(".");
        parts.pop();
        return parts.join(".");
    }
}
