import {
    Component, Input, ViewChild, ElementRef,
} from "@angular/core";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-file-list",
    templateUrl: "./file-list.component.html",
    styleUrls: ["./file-list.component.scss"],
})
export class FileListComponent {
    @Input() public edit = false;
    public files: any[] = [];
    @ViewChild("fileInput") private fileInput: ElementRef;

    constructor(private remoteService: RemoteService) {}

    public uploadFile(): void {
        this.fileInput.nativeElement.click();
    }

    public onFileSelected(event: Event): void {
        const { files } = event.target as HTMLInputElement;
        if (files[0]) {
            this.remoteService.postFile("upload/assignments/5/material", {}, "file", files[0]).subscribe((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
        }
    }
}
