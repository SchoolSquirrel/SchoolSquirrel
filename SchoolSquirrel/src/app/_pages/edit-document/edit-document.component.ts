import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FileextPipe } from "../../_pipes/fileext.pipe";

@Component({
    selector: "app-edit-document",
    templateUrl: "./edit-document.component.html",
    styleUrls: ["./edit-document.component.scss"],
})
export class EditDocumentComponent {
    public type: string;
    public onlyofficeConfig;
    private fileTypes = {
        document: ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "txt", "rtf", "odt", "ods", "odp"],
        image: ["jpg", "jpeg", "png", "tif", "svg", "gif", "bmp"],
        video: ["mp4", "avi", "mov"],
        audio: ["mp3", "wav"],
        pdf: ["pdf"],
    }

    constructor(private router: Router, private route: ActivatedRoute) {
        const fileUrl = this.getFileUrl();
        this.setFileType(fileUrl);
        this.onlyofficeConfig = {
            editorConfig: {
                document: {
                    fileType: "docx",
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
                    url: fileUrl,
                },
                documentType: "text",
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
        const fileUrl = `http://docker.for.win.localhost:3000/api/files/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}/serve?path=/${path.join("/")}`;
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
