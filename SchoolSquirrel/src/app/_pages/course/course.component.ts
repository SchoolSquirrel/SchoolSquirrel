import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../../_models/Course";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { Message } from "../../_models/Message";
import { MessageStatus } from "../../_models/MessageStatus";

@Component({
    selector: "app-course",
    templateUrl: "./course.component.html",
    styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit {
    public course: Course;

    public ajaxSettings = {};

    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.course = undefined;
            this.remoteService.get(`courses/${params.id}`).subscribe((data) => {
                this.course = data;
                for (const message of this.course.messages) {
                    message.fromMe = message.sender.id
                        == this.authenticationService.currentUser.id;
                }
                const prefix = `${this.remoteService.apiUrl}/files/course/${this.course.id}`;
                const suffix = `?authorization=${this.authenticationService.currentUser.jwtToken}`;
                this.ajaxSettings = {
                    url: `${prefix}${suffix}`,
                    downloadUrl: `${prefix}/download`,
                    uploadUrl: `${prefix}/upload${suffix}`,
                    getImageUrl: `${prefix}/serve`,
                };
            });
        });
    }

    public onMessageSent(message: Message): void {
        this.remoteService.post(`courses/${this.course.id}/chat`, { text: message.text, citation: message.citation }).subscribe((m: Message) => {
            Object.assign(this.course.messages[this.course.messages.indexOf(message)], m);
            this.course.messages[this.course.messages.findIndex((msg) => msg.id == m.id)]
                .status = MessageStatus.Sent;
        });
    }
}
