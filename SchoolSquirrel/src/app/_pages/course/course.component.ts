import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { File } from "@schoolsquirrel/filemanager/lib/File";
import { Course } from "../../_models/Course";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { Message } from "../../_models/Message";
import { MessageStatus } from "../../_models/MessageStatus";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { CourseConfigComponent } from "../../_dialogs/course-config/course-config.component";

type Tab = "chat" | "files" | "assignments" | "settings";

@Component({
    selector: "app-course",
    templateUrl: "./course.component.html",
    styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit {
    public course: Course;
    public activeTab: Tab = "chat";
    public loading = false;
    public files: File[] = [];
    // @ViewChild("filemanager") private filemanager: FileManagerComponent;

    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private route: ActivatedRoute,
        private fts: FastTranslateService,
        private modalService: NgbModal,
        private router: Router,
    ) {
        setCulture("de");
        (async () => {
            L10n.load({
                de: await this.fts.t("libraries"),
            });
        })();
    }

    /* public fileOpen(event: FileOpenEventArgs): void {
        if ((event.fileDetails as any).isFile) {
            const pathnames = this.filemanager.pathNames;
            pathnames.shift();
            pathnames.push((event.fileDetails as any).name);
            this.router.navigate(["/document/edit", "course", this.course.id, ...pathnames]);
            // ToDo
        }
    } */

    public tabChanged(tab: Tab): void {
        this.router.navigate(["/courses", this.course.id, tab]);
    }

    public ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.activeTab = params.tab || "chat";
            if (params.id != this.course?.id) {
                this.course = undefined;
                this.loadCourse(params.id);
            } else if (this.activeTab == "files") {
                this.loadFiles();
            }
        });
    }

    private loadFiles() {
        this.loading = true;
        this.remoteService.get(`files/course/${this.course.id}`).subscribe((files: File[]) => {
            this.loading = false;
            this.files = files;
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
            if (this.activeTab == "files") {
                this.loadFiles();
            }
        });
    }

    public onMessageSent(message: Message): void {
        this.remoteService.post(`courses/${this.course.id}/chat`, { text: message.text, citation: message.citation }).subscribe((m: Message) => {
            Object.assign(this.course.messages[this.course.messages.indexOf(message)], m);
            this.course.messages[this.course.messages.findIndex((msg) => msg.id == m.id)]
                .status = MessageStatus.Sent;
        });
    }

    public configureCourse(): void {
        const modal = this.modalService.open(CourseConfigComponent);
        (modal.componentInstance as CourseConfigComponent).mode = "edit";
        (modal.componentInstance as CourseConfigComponent).name = this.course.name;
        (modal.componentInstance as CourseConfigComponent).description = this.course.description;
        (modal.componentInstance as CourseConfigComponent).users = this.course.students;
        modal.result.then((result) => {
            this.loading = true;
            this.remoteService.post(`courses/${this.course.id}`, {
                name: result.name,
                description: result.description,
                users: result.users,
            }).subscribe((data) => {
                if (data && data.success) {
                    this.loadCourse(this.course.id);
                }
            });
        }, () => undefined);
    }
}
