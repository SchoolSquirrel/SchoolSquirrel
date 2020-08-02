import {
    Component, Input, ViewChild, ElementRef,
} from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { FilenamePipe } from "@src/app/_pipes/filename.pipe";
import { FileextPipe } from "@src/app/_pipes/fileext.pipe";

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

    public delete(file: Record<string, unknown>): void {
        // eslint-disable-next-line
        if (!confirm("Soll diese Datei wirklich gelöscht werden?")) {
            return;
        }
        this.remoteService.delete(`${this.context}/${this.id}/${this.type}/${new FilenamePipe().transform(file.name as string)}.${new FileextPipe().transform(file.name as string)}`).subscribe((data) => {
            if (data && data.success) {
                this.files = this.files.filter((f) => f.name !== file.name);
            }
        });
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
