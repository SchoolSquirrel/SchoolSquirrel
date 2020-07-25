import { Component, Input } from "@angular/core";

@Component({
    selector: "app-file-list",
    templateUrl: "./file-list.component.html",
    styleUrls: ["./file-list.component.scss"],
})
export class FileListComponent {
  @Input() public edit = false;
  public files: any[] = [];
}
