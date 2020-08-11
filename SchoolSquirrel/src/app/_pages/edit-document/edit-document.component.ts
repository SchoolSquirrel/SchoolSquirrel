import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FileextPipe } from "../../_pipes/fileext.pipe";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-edit-document",
    templateUrl: "./edit-document.component.html",
    styleUrls: ["./edit-document.component.scss"],
})
export class EditDocumentComponent {
    public type: string;
    public fileUrl: string;
    public onlyofficeConfig;
    private documentFileTypes = {
        text: ["docx", "doc", "txt", "rtf", "odt"],
        spreadsheet: ["xlsx", "xls", "ods"],
        presentation: ["pptx", "ppt", "odp"],
    }
    private fileTypes = {
        document: (Object.values(this.documentFileTypes) as any).flat(),
        image: ["jpg", "jpeg", "png", "tif", "svg", "gif", "bmp"],
        video: ["mp4", "avi", "mov"],
        audio: ["mp3", "wav"],
        pdf: ["pdf"],
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private remoteService: RemoteService,
    ) {
        this.fileUrl = this.getFileUrl();
        this.setFileType(this.fileUrl);
        this.onlyofficeConfig = {
            editorConfig: {
                document: {
                    fileType: new FileextPipe().transform(this.fileUrl),
                    /* info: {
                        author: "Me",
                        created: "26.11.19",
                    },
                    key: "3277238458",
                    permissions: {
                        download: true,
                        edit: true,
                    }, */
                    title: "TestTitle",
                    url: this.fileUrl.replace(this.remoteService.apiUrl, "http://docker.for.win.localhost:3000/api/"),
                },
                editorConfig: {
                    embedded: {
                        embedUrl: "example.com",
                        saveUrl: "example.com",
                        shareUrl: "example.com",
                        toolbarDocked: "top",
                    },
                    lang: "de",
                    mode: "edit",
                }, /*
                events: {
                    onBack: console.log,
                    onDocumentStateChange: console.log,
                    onError: console.log,
                    onReady: console.log,
                    onRequestEditRights: console.log,
                    onSave: console.log,
                },
                type: "desktop", */
                height: "100%",
                width: "100%",
            },
            script: "http://localhost:8080/web-apps/apps/api/documents/api.js",
        };
    }

    private getFileUrl() {
        let { url } = this.router;
        // Firefox does weird stuff on page refresh: the encoded chars are encoded again...
        do {
            url = decodeURI(url);
        } while (url.indexOf("%") !== -1);
        const path = url.split("/");
        for (let i = 0; i < 4; i++) {
            path.shift();
        }
        const fileUrl = `${this.remoteService.apiUrl}/files/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}/serve?path=/${path.join("/")}`;
        return fileUrl;
    }

    private setFileType(fileUrl: string) {
        const fileextPipe = new FileextPipe();
        for (const [type, extensions] of Object.entries(this.fileTypes)) {
            if (extensions.includes(fileextPipe.transform(fileUrl))) {
                this.type = type;
                return;
            }
        }
    }
}
