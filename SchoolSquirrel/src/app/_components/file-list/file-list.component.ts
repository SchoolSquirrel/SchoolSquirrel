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
    @Input() public type: "materials" | "worksheets" = "materials";
    @Input() public id: number;
    @Input() public files: any[] = [];
    // eslint-disable-next-line react/static-property-placement
    @Input() public context: string;
    @ViewChild("fileInput") private fileInput: ElementRef;

    constructor(private remoteService: RemoteService) {}

    public uploadFile(): void {
        this.fileInput.nativeElement.click();
    }

    public onFileSelected(event: Event): void {
        if (!this.id || !this.edit) {
            return;
        }
        const { files } = event.target as HTMLInputElement;
        if (files[0]) {
            this.remoteService.postFile(`upload/${this.context}/${this.id}/${this.type}`, {}, "file", files[0]).subscribe((e) => {
                if (e && typeof e == "object") {
                    this.files.push(e);
                }
            });
        }
    }
}
