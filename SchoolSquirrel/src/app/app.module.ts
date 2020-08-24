import {
    NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,
    LOCALE_ID,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import {
    GridModule, PageService, SortService,
    FilterService, EditService, ToolbarService, ForeignKeyService,
} from "@syncfusion/ej2-angular-grids";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { registerLocaleData } from "@angular/common";
import {
    ScheduleModule, DayService, WeekService, WorkWeekService, MonthService,
    AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService,
} from "@syncfusion/ej2-angular-schedule";
import { loadCldr } from "@syncfusion/ej2-base";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { SquirrelChatUiModule } from "@schoolsquirrel/squirrel-chat-ui";
import {
    FileManagerModule, NavigationPaneService, DetailsViewService, ToolbarService as FToolbarService,
} from "@syncfusion/ej2-angular-filemanager";
import { EditorModule } from "@tinymce/tinymce-angular";
import { NgxOnlyOfficeModule } from "ngx-onlyoffice";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { DeviceDetectorModule } from "ngx-device-detector";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { ToastComponent } from "./_components/toast/toast.component";
import { SidebarComponent } from "./_components/sidebar/sidebar.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";
import { AssignmentComponent } from "./_pages/assignment/assignment.component";
import { CalendarComponent } from "./_pages/calendar/calendar.component";
import { UsersComponent } from "./_pages/_admin/users/users.component";
import { SettingsComponent } from "./_pages/_admin/settings/settings.component";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { NavbarActionsService } from "./_services/navbar-actions.service";
import { CoursesComponent } from "./_pages/courses/courses.component";
import { SelectUsersComponent } from "./_dialogs/select-users/select-users.component";
import { AppRoutingModule } from "./app-routing.module";
import { CourseComponent } from "./_pages/course/course.component";
import { FullPageLoadingComponent } from "./_components/full-page-loading/full-page-loading.component";
import { ChatComponent } from "./_pages/chat/chat.component";
import { NgbDateCustomParserFormatter } from "./_helpers/NgbDateCustomParserFormatter";
import { SafeUserHtmlPipe } from "./_pipes/safe-user-html.pipe";
import { FilenamePipe } from "./_pipes/filename.pipe";
import { FileextPipe } from "./_pipes/fileext.pipe";
import { FilesizePipe } from "./_pipes/filesize.pipe";
import { HtmlToTextPipe } from "./_pipes/html-to-text.pipe";
import { AssignmentItemComponent } from "./_components/assignment-item/assignment-item.component";
import { UserNameComponent } from "./_components/user-name/user-name.component";
import { NativescriptSquirrelChatUiComponent } from "./_components/nativescript-squirrel-chat-ui/nativescript-squirrel-chat-ui.component";
import { FileListComponent } from "./_components/file-list/file-list.component";
import { FileIconComponent } from "./_components/file-icon/file-icon.component";
import { EditDocumentComponent } from "./_pages/edit-document/edit-document.component";
import { AvatarComponent } from "./_components/avatar/avatar.component";
import { CourseConfigComponent } from "./_dialogs/course-config/course-config.component";
import { UserChipComponent } from "./_components/user-chip/user-chip.component";
import { AssignmentStatusbarComponent } from "./_components/assignment-statusbar/assignment-statusbar.component";
import { HelpComponent } from "./_components/help/help.component";
import { UserSettingsComponent } from "./_pages/user-settings/user-settings.component";

registerLocaleData(localeDe, localeDeExtra);
declare const require: any;
loadCldr(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("cldr-data/supplemental/numberingSystems.json"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("cldr-data/main/de/ca-gregorian.json"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("cldr-data/main/de/numbers.json"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("cldr-data/main/de/timeZoneNames.json"),
);

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ToastComponent,
        SidebarComponent,
        NavbarComponent,
        AssignmentsComponent,
        AssignmentComponent,
        CalendarComponent,
        UsersComponent,
        SettingsComponent,
        CoursesComponent,
        SelectUsersComponent,
        CourseComponent,
        FullPageLoadingComponent,
        ChatComponent,
        AssignmentComponent,
        SafeUserHtmlPipe,
        HtmlToTextPipe,
        FilenamePipe,
        FileextPipe,
        FilesizePipe,
        AssignmentItemComponent,
        UserNameComponent,
        NativescriptSquirrelChatUiComponent,
        FileListComponent,
        FileIconComponent,
        EditDocumentComponent,
        AvatarComponent,
        CourseConfigComponent,
        UserChipComponent,
        AssignmentStatusbarComponent,
        HelpComponent,
        UserSettingsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            defaultLanguage: "de",
        }),
        GridModule,
        ScheduleModule,
        FileManagerModule,
        SquirrelChatUiModule,
        NoopAnimationsModule,
        EditorModule,
        NgxOnlyOfficeModule,
        NgxExtendedPdfViewerModule,
        DeviceDetectorModule,
        PasswordStrengthMeterModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
        { provide: LOCALE_ID, useValue: "de-DE" },
        PageService,
        SortService,
        FilterService,
        EditService,
        ToolbarService,
        ForeignKeyService,
        DayService,
        WeekService,
        WorkWeekService,
        MonthService,
        AgendaService,
        MonthAgendaService,
        TimelineViewsService,
        TimelineMonthService,
        NavigationPaneService,
        FToolbarService,
        DetailsViewService,
        FileextPipe,
        FilenamePipe,
        FilesizePipe,
        { provide: "navbarActionsService", useExisting: NavbarActionsService },
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [CourseConfigComponent],
})
export class AppModule {}
