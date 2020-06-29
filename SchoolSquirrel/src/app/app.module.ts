import {
    NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,
    LOCALE_ID,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
import { AppComponent } from "./app.component";
import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { ToastComponent } from "./_components/toast/toast.component";
import { SidebarComponent } from "./_components/sidebar/sidebar.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";
import { CalendarComponent } from "./_pages/calendar/calendar.component";
import { UsersComponent } from "./_pages/_admin/users/users.component";
import { SettingsComponent } from "./_pages/_admin/settings/settings.component";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { NavbarActionsService } from "./_services/navbar-actions.service";
import { CoursesComponent } from "./_pages/courses/courses.component";
import { SelectUsersComponent } from "./_components/select-users/select-users.component";
import { AppRoutingModule } from "./app-routing.module";
import { CourseComponent } from "./_pages/course/course.component";
import { FullPageLoadingComponent } from "./_components/full-page-loading/full-page-loading.component";
import { ChatComponent } from "./_pages/chat/chat.component";

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
        CalendarComponent,
        UsersComponent,
        SettingsComponent,
        CoursesComponent,
        SelectUsersComponent,
        CourseComponent,
        FullPageLoadingComponent,
        ChatComponent,
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
        SquirrelChatUiModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
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
        { provide: "navbarActionsService", useExisting: NavbarActionsService },
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
