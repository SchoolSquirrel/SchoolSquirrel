import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "fileext",
})
export class FileextPipe implements PipeTransform {
    public transform(value: string): string {
        return value.split(".").pop();
    }
}
