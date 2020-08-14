import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthenticationService } from "../../_services/authentication.service";
import { FileextPipe } from "../../_pipes/fileext.pipe";
import { RemoteService } from "../../_services/remote.service";
import { FilenamePipe } from "../../_pipes/filename.pipe";

@Component({
    selector: "app-edit-document",
    templateUrl: "./edit-document.component.html",
    styleUrls: ["./edit-document.component.scss"],
})
export class EditDocumentComponent {
    public type: string;
    public fileUrl: string;
    public onlyofficeConfig;
    public loading = true;
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
        private deviceService: DeviceDetectorService,
        private authenticationService: AuthenticationService,
    ) {
        this.fileUrl = this.getFileUrl("serve");
        this.setFileType(this.fileUrl);
        if (this.type !== "document") {
            this.loading = false;
        } else {
            this.remoteService.get(this.getFileUrl("editKey", true)).subscribe((d) => {
                if (d?.editKey) {
                    this.loading = false;
                    this.onlyofficeConfig = {
                        editorConfig: {
                            document: {
                                fileType: new FileextPipe().transform(this.fileUrl),
                                /* info: {
                                    author: "Me",
                                    created: "26.11.19",
                                },
                                permissions: {
                                    download: true,
                                    edit: true,
                                }, */
                                key: d.editKey,
                                title: `${new FilenamePipe().transform(this.fileUrl)}.${new FileextPipe().transform(this.fileUrl)}`,
                                url: this.fixUrlForContainer(this.fileUrl),
                            },
                            editorConfig: {
                                embedded: {
                                    embedUrl: "example.com",
                                    saveUrl: "example.com",
                                    shareUrl: "example.com",
                                    toolbarDocked: "top",
                                },
                                lang: "de",
                                mode: this.route.snapshot.params.action == "edit" ? "edit" : "view",
                                callbackUrl: this.fixUrlForContainer(this.getFileUrl("save")),
                                user: {
                                    name: this.authenticationService.currentUser.name,
                                    id: this.authenticationService.currentUser.id,
                                },
                            }, /*
                            events: {
                                onBack: console.log,
                                onDocumentStateChange: console.log,
                                onError: console.log,
                                onReady: console.log,
                                onRequestEditRights: console.log,
                                onSave: console.log,
                            }, */
                            type: this.deviceService.isDesktop() ? "desktop" : "mobile",
                            height: "100%",
                            width: "100%",
                        },
                        script: "http://localhost:8080/web-apps/apps/api/documents/api.js",
                    };
                }
            });
        }
    }

    private fixUrlForContainer(url) {
        return url.replace(this.remoteService.apiUrl, "http://docker.for.win.localhost:3000/api/");
    }

    private getFileUrl(type: "serve" | "save" | "editKey", skipApiUrl = false) {
        let { url } = this.router;
        // Firefox does weird stuff on page refresh: the encoded chars are encoded again...
        do {
            url = decodeURI(url);
        } while (url.indexOf("%") !== -1);
        const path = url.split("/");
        for (let i = 0; i < 5; i++) {
            path.shift();
        }
        const fileUrl = `${skipApiUrl ? "" : this.remoteService.apiUrl}/files/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}/${type}?path=/${path.join("/")}`;
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
