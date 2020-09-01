import { Component, NgZone } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as RecordRTC from "recordrtc";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { RemoteService } from "../../_services/remote.service";
import { isElectron } from "../../_helpers/isElectron";

@Component({
    selector: "app-record-video",
    templateUrl: "./record-video.component.html",
    styleUrls: ["./record-video.component.scss"],
})
export class RecordVideoComponent {
    public loading = false;
    public showPreview = false;
    public showPreviewControls = false;
    public mode: "webcam" | "screen";
    public setupDone = false;
    public permissionError = false;
    public recordingStatus: "stopped" | "paused" | "recording" = "stopped";
    public blob: Blob;
    public blobUrl: SafeResourceUrl;
    private recorder: RecordRTC;
    private stream: MediaStream;
    public uploading: number;
    public uploadSettings: {url: string, path: string};
    public duration: string;
    public device: MediaDeviceInfo | true;
    public devices: MediaDeviceInfo[] = [];
    public isElectron: boolean = isElectron();
    constructor(
        public modal: NgbActiveModal,
        private zone: NgZone,
        private sanitizer: DomSanitizer,
        private remoteService: RemoteService,
    ) { }

    public upload(): void {
        this.uploading = 0;
        const file = new File([this.blob], "myVideo.webm");
        this.remoteService.postFile(this.uploadSettings.url, {
            path: this.uploadSettings.path,
        }, "file", file, true).subscribe((data: HttpEvent<any>) => {
            if (data.type == HttpEventType.UploadProgress) {
                this.uploading = Math.round(100 * (data.loaded / data.total));
            } else if (data.type == HttpEventType.Response) {
                if (data.body && Array.isArray(data.body)) {
                    this.modal.close(data.body);
                }
            }
        });
    }

    public setMode(mode: "webcam" | "screen"): void {
        this.mode = mode;
        this.permissionError = false;
        if (!this.isElectron) {
            this.useDevice(true);
            return;
        }
        // eslint-disable-next-line
        (mode == "webcam" ? navigator.mediaDevices.enumerateDevices() : window.require("electron").desktopCapturer.getSources({types: ["screen", "window"]})).then(async (devices) => {
            if (mode == "webcam") {
                this.devices = devices.filter((d) => d.kind == "videoinput");
                for (const device of this.devices) {
                    try {
                        let video = document.createElement("video");
                        const stream = await navigator.mediaDevices.getUserMedia({
                            video: { deviceId: { exact: device.deviceId } },
                        });
                        video.srcObject = stream;
                        video.play();
                        video.onloadeddata = () => {
                            let canvas = document.createElement("canvas");
                            canvas.setAttribute("width", "480");
                            canvas.setAttribute("height", "270");
                            const context = canvas.getContext("2d");
                            context.drawImage(video, 0, 0, 480, 270);
                            (device as any).thumbnail = this.sanitizer
                                .bypassSecurityTrustResourceUrl(canvas.toDataURL());
                            video = undefined;
                            canvas = undefined;
                        };
                        // video.play();
                    } catch {
                        (device as any).thumbnail = "assets/illustrations/question.svg";
                    }
                }
            } else {
                this.devices = devices.map((d) => {
                    d.thumbnail = this.sanitizer.bypassSecurityTrustResourceUrl(
                        d.thumbnail.toDataURL(),
                    );
                    return d;
                });
            }
        }, () => {
            this.permissionError = true;
        });
    }

    public useDevice(device: MediaDeviceInfo | true): void {
        this.device = device;
        let promise;
        if (this.isElectron && device !== true) {
            if (this.mode == "webcam") {
                promise = navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: device.deviceId } },
                });
            } else {
                promise = navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: (device as any).id,
                            minWidth: 1920 / 4,
                            maxWidth: 1920 * 2,
                            minHeight: 1080 / 4,
                            maxHeight: 1080 * 2,
                        },
                    } as any,
                });
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.mode == "webcam") {
                promise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } else {
                promise = (navigator.mediaDevices as any)?.getDisplayMedia({})
                    || (navigator as any).getDisplayMedia({});
            }
        }
        promise.then(async (stream) => {
            this.stream = stream;
            this.recorder = new RecordRTC(stream, {
                type: "video",
                mimeType: "video/mp4",
                timeSlice: 1000,
                onTimeStamp: ((timestamp, timestamps) => {
                    const pad = (n) => (n < 10 ? `0${n}` : n);
                    this.zone.run(() => {
                        const seconds = (new Date().getTime() - timestamps[0]) / 1000;
                        const h = Math.floor(seconds / 3600);
                        const m = Math.floor(seconds / 60) - (h * 60);
                        const s = Math.floor(seconds - h * 3600 - m * 60);
                        this.duration = `${pad(h)}:${pad(m)}:${pad(s)}`;
                    });
                }),
            });
            this.setupDone = true;
            setTimeout(() => {
                (document.querySelector("video#preview") as HTMLVideoElement).srcObject = stream;
            });
        }, () => {
            this.permissionError = true;
        });
    }

    public startRecording(): void {
        this.recordingStatus = "recording";
        this.recorder.startRecording();
    }

    public pauseRecording(): void {
        this.recordingStatus = "paused";
        this.recorder.pauseRecording();
    }

    public resumeRecording(): void {
        this.recordingStatus = "recording";
        this.recorder.resumeRecording();
    }

    public stopRecording(): void {
        this.recordingStatus = "stopped";
        this.loading = true;
        this.recorder.stopRecording(() => {
            this.zone.run(() => {
                this.loading = false;
                this.stream.getTracks().forEach((track) => {
                    track.stop();
                });
                this.blob = this.recorder.getBlob();
                this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.recorder.toURL());
            });
        });
    }

    public downloadVideo(): void {
        if (this.blob) {
            // eslint-disable-next-line no-use-before-define
            this.invokeSaveAsDialog(this.blob);
        }
    }

    private invokeSaveAsDialog(file: Blob, fileName?: string): boolean {
        if (!file) {
            throw new Error("Blob object is required.");
        }

        if (!file.type) {
            try {
                (file as any).type = "video/webm";
            } catch (e) {
            //
            }
        }

        let fileExtension = (file.type || "video/webm").split("/")[1];

        if (fileName && fileName.indexOf(".") !== -1) {
            const splitted = fileName.split(".");
            [fileName, fileExtension] = splitted;
        }

        const fileFullName = `${fileName || (Math.round(Math.random() * 9999999999) + 888888888)}.${fileExtension}`;

        if (typeof navigator.msSaveOrOpenBlob !== "undefined") {
            return navigator.msSaveOrOpenBlob(file, fileFullName);
        } if (typeof navigator.msSaveBlob !== "undefined") {
            return navigator.msSaveBlob(file, fileFullName);
        }

        const hyperlink = document.createElement("a");
        hyperlink.href = URL.createObjectURL(file);
        hyperlink.download = fileFullName;

        (hyperlink as any).style = "display:none;opacity:0;color:transparent;";
        (document.body || document.documentElement).appendChild(hyperlink);

        if (typeof hyperlink.click === "function") {
            hyperlink.click();
        } else {
            hyperlink.target = "_blank";
            hyperlink.dispatchEvent(new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
            }));
        }

        URL.revokeObjectURL(hyperlink.href);
        return true;
    }
}
