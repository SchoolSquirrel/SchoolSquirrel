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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { SquirrelChatUiModule } from "@schoolsquirrel/squirrel-chat-ui";
import {
    FileManagerModule, NavigationPaneService, DetailsViewService, ToolbarService as FToolbarService,
} from "@syncfusion/ej2-angular-filemanager";
import { EditorModule } from "@tinymce/tinymce-angular";
import { NgxOnlyOfficeModule } from "ngx-onlyoffice";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { DeviceDetectorModule } from "ngx-device-detector";
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/_pages/home/home.component';
import { LoginComponent } from '@src/app/_pages/login/login.component';
import { ErrorInterceptor } from '@src/app/_interceptors/error.interceptor';
import { ToastComponent } from '@src/app/_components/toast/toast.component';
import { SidebarComponent } from '@src/app/_components/sidebar/sidebar.component';
import { NavbarComponent } from '@src/app/_components/navbar/navbar.component';
import { AssignmentsComponent } from '@src/app/_pages/assignments/assignments.component';
import { AssignmentComponent } from '@src/app/_pages/assignment/assignment.component';
import { CalendarComponent } from '@src/app/_pages/calendar/calendar.component';
import { UsersComponent } from '@src/app/_pages/_admin/users/users.component';
import { SettingsComponent } from '@src/app/_pages/_admin/settings/settings.component';
import { JwtInterceptor } from '@src/app/_interceptors/jwt.interceptor';
import { NavbarActionsService } from '@src/app/_services/navbar-actions.service';
import { CoursesComponent } from '@src/app/_pages/courses/courses.component';
import { SelectUsersComponent } from '@src/app/_dialogs/select-users/select-users.component';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { CourseComponent } from '@src/app/_pages/course/course.component';
import { FullPageLoadingComponent } from '@src/app/_components/full-page-loading/full-page-loading.component';
import { ChatComponent } from '@src/app/_pages/chat/chat.component';
import { NgbDateCustomParserFormatter } from '@src/app/_helpers/NgbDateCustomParserFormatter';
import { SafeUserHtmlPipe } from '@src/app/_pipes/safe-user-html.pipe';
import { FilenamePipe } from '@src/app/_pipes/filename.pipe';
import { FileextPipe } from '@src/app/_pipes/fileext.pipe';
import { FilesizePipe } from '@src/app/_pipes/filesize.pipe';
import { HtmlToTextPipe } from '@src/app/_pipes/html-to-text.pipe';
import { AssignmentItemComponent } from '@src/app/_components/assignment-item/assignment-item.component';
import { UserNameComponent } from '@src/app/_components/user-name/user-name.component';
import { NativescriptSquirrelChatUiComponent } from '@src/app/_components/nativescript-squirrel-chat-ui/nativescript-squirrel-chat-ui.component';
import { FileListComponent } from '@src/app/_components/file-list/file-list.component';
import { FileIconComponent } from '@src/app/_components/file-icon/file-icon.component';
import { EditDocumentComponent } from '@src/app/_pages/edit-document/edit-document.component';
import { AvatarComponent } from '@src/app/_components/avatar/avatar.component';

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
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        EditorModule,
        NgxOnlyOfficeModule,
        NgxExtendedPdfViewerModule,
        DeviceDetectorModule,
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
})
export class AppModule {}
