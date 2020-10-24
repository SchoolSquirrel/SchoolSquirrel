import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Course } from "../../_models/Course";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { Message } from "../../_models/Message";
import { MessageStatus } from "../../_models/MessageStatus";
import { FastTranslateService } from "../../_services/fast-translate.service";

type Tab = "chat" | "files" | "assignments" | "settings";

@Component({
    selector: "app-course",
    templateUrl: "./course.component.html",
    styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit {
    public course: Course;
    public ajaxSettings = {};
    public activeTab: Tab = "chat";
    public loading = false;

    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private route: ActivatedRoute,
        private fts: FastTranslateService,
        private router: Router,
    ) {}

    public tabChanged(tab: Tab): void {
        this.router.navigate(["/courses", this.course.id, tab]);
    }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.activeTab = params.tab || "chat";
            if (params.id != this.course?.id) {
                this.course = undefined;
                this.loadCourse(params.id);
            }
        });
    }

    private loadCourse(id: number) {
        this.remoteService.get(`courses/${id}`).subscribe((data) => {
            this.loading = false;
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
    }

    public onMessageSent(message: Message): void {
        this.remoteService.post(`courses/${this.course.id}/chat`, { text: message.text, citation: message.citation }).subscribe((m: Message) => {
            Object.assign(this.course.messages[this.course.messages.indexOf(message)], m);
            this.course.messages[this.course.messages.findIndex((msg) => msg.id == m.id)]
                .status = MessageStatus.Sent;
        });
    }
}
