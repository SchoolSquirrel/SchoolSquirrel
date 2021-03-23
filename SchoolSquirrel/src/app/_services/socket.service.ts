import { Injectable } from "@angular/core";
import * as socketIO from "socket.io-client";
import { Router } from "@angular/router";
import { ToastService } from "./toast.service";
import { RemoteService } from "./remote.service";

@Injectable()
export class SocketService {
    public socket: socketIO.Socket;
    constructor(
        private toastService: ToastService,
        private remoteService: RemoteService,
    ) { }

    public init(token: string): void {
        const url = `${this.remoteService.apiUrl}/live`;
        this.socket = socketIO.io(url);
        this.socket.on("connect", () => {
            this.socket.emit("login", { token });
        });
        this.socket.on("failure", (msg) => {
            this.toastService.error(msg);
        });
    }
}
