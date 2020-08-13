import {
    NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, Directive,
} from "@angular/core";
import {
    NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpClientModule, registerElement,
} from "@nativescript/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NativeScriptLoader } from "@danvick/ngx-translate-nativescript-loader";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { registerLocaleData } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";
import { CalendarComponent } from "./_pages/calendar/calendar.component";
import { UsersComponent } from "./_pages/_admin/users/users.component";
import { SettingsComponent } from "./_pages/_admin/settings/settings.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { SidebarComponent } from "./_components/sidebar/sidebar.component";
import { ToastComponent } from "./_components/toast/toast.component";
import { CoursesComponent } from "./_pages/courses/courses.component";
import { SelectUsersComponent } from "./_dialogs/select-users/select-users.component";
import { CourseComponent } from "./_pages/course/course.component";
import { FullPageLoadingComponent } from "./_components/full-page-loading/full-page-loading.component";
import { ChatComponent } from "./_pages/chat/chat.component";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { HideActionBarDirective } from "./_directives/hideActionBar.directive";
import { AssignmentItemComponent } from "./_components/assignment-item/assignment-item.component";
import { AssignmentComponent } from "./_pages/assignment/assignment.component";
import { HtmlToTextPipe } from "./_pipes/html-to-text.pipe";
import { NativescriptSquirrelChatUiComponent } from "./_components/nativescript-squirrel-chat-ui/nativescript-squirrel-chat-ui.component";
import { FileListComponent } from "./_components/file-list/file-list.component";
import { FileIconComponent } from "./_components/file-icon/file-icon.component";
import { EditDocumentComponent } from "./_pages/edit-document/edit-document.component";
import { AvatarComponent } from "./_components/avatar/avatar.component";
import { CourseConfigComponent } from "./_dialogs/course-config/course-config.component";
import { UserChipComponent } from "./_components/user-chip/user-chip.component";

registerLocaleData(localeDe, localeDeExtra);

registerElement(
    "Fab",
    // eslint-disable-next-line
    () => require("@nstudio/nativescript-floatingactionbutton").Fab,
);

@Directive({
    selector: "EmojiPicker",
})
export class EmojiPickerDirective { }

@Directive({
    selector: "EmojiLabel",
})
export class EmojiLabelDirective { }
// eslint-disable-next-line
registerElement("EmojiPicker", () => require("nativescript-emoji-picker").EmojiPicker);
// eslint-disable-next-line
registerElement("EmojiLabel", () => require("nativescript-emoji-picker").EmojiLabel);

export function nativescriptTranslateLoaderFactory(): NativeScriptLoader {
    return new NativeScriptLoader("./assets/i18n/", ".json");
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
        HideActionBarDirective,
        AssignmentItemComponent,
        HtmlToTextPipe,
        NativescriptSquirrelChatUiComponent,
        FileListComponent,
        FileIconComponent,
        EditDocumentComponent,
        AvatarComponent,
        CourseConfigComponent,
        UserChipComponent,
    ],
    imports: [
        ReactiveFormsModule,
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUICalendarModule,
        NativeScriptUIListViewModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: nativescriptTranslateLoaderFactory,
            },
            defaultLanguage: "de",
        }),
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
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
