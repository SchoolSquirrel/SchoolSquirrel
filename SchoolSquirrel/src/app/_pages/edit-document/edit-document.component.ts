import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthenticationService } from "../../_services/authentication.service";
import { FileextPipe } from "../../_pipes/fileext.pipe";
import { RemoteService } from "../../_services/remote.service";
import { FilenamePipe } from "../../_pipes/filename.pipe";
import { fileTypes } from "../../_resources/file-types";
import { ConfigService } from "../../_services/config.service";

type Config = {
    action: "view" | "edit",
    type: string,
    path: string,
    id: string,
};

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
    public filePath: string;
    private _config;
    @Input()
    public set config(config: Config) {
        this._config = config;
        this.init({
            type: config.type,
            id: config.id,
            action: config.action,
            overwritePath: config.path,
        });
    }
    public get config(): Config {
        return this._config;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private remoteService: RemoteService,
        private deviceService: DeviceDetectorService,
        private authenticationService: AuthenticationService,
        private configService: ConfigService,
    ) {}

    public ngOnInit(): void {
        if (!this._config) {
            this.route.params.subscribe((params) => {
                this.init(params);
            });
        }
    }

    private init(params) {
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
            script: `${this.configService.config.onlyofficeUrl}/web-apps/apps/api/documents/api.js`,
        };
    }

    private fixUrlForContainer(url) {
        return url.replace(this.remoteService.apiUrl, "http://host.docker.internal:3003/api/");
    }

    private getFileUrl(params, type: "serve" | "save" | "editKey", skipApiUrl = false) {
        if (params.overwritePath) {
            this.filePath = params.overwritePath;
        } else {
            let { url } = this.router;
            // Firefox does weird stuff on page refresh: the encoded chars are encoded again...
            do {
                url = decodeURI(url);
            } while (url.indexOf("%") !== -1);
            const path = url.split("/");
            for (let i = 0; i < 5; i++) {
                path.shift();
            }
            this.filePath = path.join("/");
        }
        const fileUrl = `${skipApiUrl ? "" : this.remoteService.apiUrl}/files/${params.type}/${params.id}/${type}?path=/${this.filePath}&authorization=${this.authenticationService.currentUser.jwtToken}`;
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
