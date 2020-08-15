import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { ToastService } from "../../_services/toast.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { FileextPipe } from "../../_pipes/fileext.pipe";
import { RemoteService } from "../../_services/remote.service";
import { FilenamePipe } from "../../_pipes/filename.pipe";
import { fileTypes } from "../../_resources/file-types";

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
    filePath: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private remoteService: RemoteService,
        private deviceService: DeviceDetectorService,
        private authenticationService: AuthenticationService,
        private toastService: ToastService,
    ) {
        this.route.params.subscribe((params) => {
            this.fileUrl = this.getFileUrl(params, "serve");
            this.setFileType();
            if (this.type !== "document") {
                this.loading = false;
            } else if (params.action == "view") {
                this.loading = false;
                this.setOnlyOfficeConfig(params);
            } else {
                this.remoteService.get(this.getFileUrl(params, "editKey", true)).subscribe((d) => {
                    if (d?.editKey) {
                        this.loading = false;
                        this.setOnlyOfficeConfig(params, d.editKey);
                    }
                }, (e) => {
                    if (e?.redirectToViewMode) {
                        this.router.navigateByUrl(this.router.url.replace("/edit/", "/view/"));
                    }
                });
            }
        });
    }

    private setOnlyOfficeConfig(params, editKey?: string) {
        this.onlyofficeConfig = {
            editorConfig: {
                document: {
                    fileType: new FileextPipe().transform(this.filePath),
                    /* info: {
                        author: "Me",
                        created: "26.11.19",
                    },
                    permissions: {
                        download: true,
                        edit: true,
                    }, */
                    key: editKey || "",
                    title: `${new FilenamePipe().transform(this.filePath)}.${new FileextPipe().transform(this.filePath)}`,
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
                    mode: params.action == "edit" ? "edit" : "view",
                    callbackUrl: `${this.fixUrlForContainer(this.getFileUrl(params, "save"))}`,
                    user: {
                        name: this.authenticationService.currentUser.name,
                        id: this.authenticationService.currentUser.id,
                    },
                },

                type: this.deviceService.isDesktop() ? "desktop" : "mobile",
                height: "100%",
                width: "100%",
            },
            script: "http://localhost:8080/web-apps/apps/api/documents/api.js",
        };
    }

    private fixUrlForContainer(url) {
        return url.replace(this.remoteService.apiUrl, "http://docker.for.win.localhost:3000/api/");
    }

    private getFileUrl(params, type: "serve" | "save" | "editKey", skipApiUrl = false) {
        let { url } = this.router;
        // Firefox does weird stuff on page refresh: the encoded chars are encoded again...
        do {
            url = decodeURI(url);
        } while (url.indexOf("%") !== -1);
        const path = url.split("/");
        for (let i = 0; i < 5; i++) {
            path.shift();
        }
        const fileUrl = `${skipApiUrl ? "" : this.remoteService.apiUrl}/files/${params.type}/${params.id}/${type}?path=/${path.join("/")}&authorization=${this.authenticationService.currentUser.jwtToken}`;
        this.filePath = path.join("/");
        return fileUrl;
    }

    private setFileType() {
        const fileextPipe = new FileextPipe();
        for (const [type, extensions] of Object.entries(fileTypes)) {
            if (extensions.includes(fileextPipe.transform(this.filePath))) {
                this.type = type;
                return;
            }
        }
    }
}
