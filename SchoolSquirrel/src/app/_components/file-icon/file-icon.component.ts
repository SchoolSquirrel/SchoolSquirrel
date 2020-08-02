import { Component, Input } from "@angular/core";

@Component({
    selector: "app-file-icon",
    templateUrl: "./file-icon.component.html",
    styleUrls: ["./file-icon.component.scss"],
})
export class FileIconComponent {
  @Input() public ext: string;
  @Input() public size: "xxl" | "xl" | "lg" | "md" | "sm" | "xs" | "xxs" = "xxs";
}
