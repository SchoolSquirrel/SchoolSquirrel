import {
    Component, Input, ViewChild, ElementRef, Output, EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { FileextPipe } from "../../_pipes/fileext.pipe";
import { editableFileTypes } from "../../_resources/file-types";
import { RecordVideoComponent } from "../../_dialogs/record-video/record-video.component";

@Component({
    selector: "app-file-list",
    templateUrl: "./file-list.component.html",
    styleUrls: ["./file-list.component.scss"],
})
export class FileListComponent {
    @Input() public edit = false;
    @Input() public viewOnlyMode = false;
    @Input() public selectMode = false;
    @Input() public type: "materials" | "worksheets" | "submissions";
    @Input() public id: number;
    @Input() public files: any[] = [];
    @Input() public context: string;
    @Output() public fileSelected: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("fileInput") private fileInput: ElementRef;
    public filesWhichCanBeEdited: string[] = ["docx", "xlsx", "pptx"];

    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private modalService: NgbModal,
    ) { }

    public uploadFile(): void {
        this.fileInput.nativeElement.click();
    }

    public viewOrEdit(file: { name: string }): void {
        const parts = file.name.split("/");
        parts.shift();
        const data = ["/document", this.viewOnlyMode || (this.type == "materials" && !this.edit) ? "view" : "edit", "assignments", this.id, ...parts];
        if (this.edit && this.type !== "submissions") {
            window.open(this.router.serializeUrl(this.router.createUrlTree(data)), "_blank");
        } else {
            this.router.navigate(data);
        }
    }

    public delete(file: {name: string}): void {
        // eslint-disable-next-line
        if (!confirm("Soll diese Datei wirklich gelöscht werden?")) {
            return;
        }
        this.remoteService.delete(`files/${this.context}/${file.name}`).subscribe((data) => {
            if (data && data.success) {
                this.files = this.files.filter((f) => f.name !== file.name);
            }
        });
    }

    public createVideo(): void {
        const modal = this.modalService.open(RecordVideoComponent, { size: "xl" });
        (modal.componentInstance as RecordVideoComponent).uploadSettings = {
            url: `files/${this.context}/${this.id}/upload`,
            path: `/${this.type}/`,
        };
        modal.result.then((files) => {
            this.files = files;
        }, () => undefined);
    }

    public download(file: { name: string }): void {
        window.open(this.remoteService.getImageUrl(`files/${this.context}/${file.name}`, this.authenticationService), "_blank");
    }

    public onFileSelected(event: Event): void {
        if (!this.id || !this.edit) {
            return;
        }
        const { files } = event.target as HTMLInputElement;
        if (files[0]) {
            this.remoteService.postFile(`files/${this.context}/${this.id}/upload`, {
                path: `/${this.type}/`,
            }, "file", files[0]).subscribe((e) => {
                if (e && Array.isArray(e)) {
                    this.files = e;
                }
            });
        }
    }

    public newFile(type: "docx" | "xlsx" | "pptx"): void {
        this.remoteService.post(`files/${this.context}/${this.id}/new/${this.type}/Unbenannt.${type}`, {}).subscribe((e) => {
            if (e && Array.isArray(e)) {
                this.files = e;
            }
        });
    }

    public canBeEdited(file: { name: string }): boolean {
        return !this.viewOnlyMode
            && editableFileTypes.includes(new FileextPipe().transform(file.name));
    }
}
