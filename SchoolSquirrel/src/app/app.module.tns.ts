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
import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/_pages/home/home.component';
import { LoginComponent } from '@src/app/_pages/login/login.component';
import { AssignmentsComponent } from '@src/app/_pages/assignments/assignments.component';
import { CalendarComponent } from '@src/app/_pages/calendar/calendar.component';
import { UsersComponent } from '@src/app/_pages/_admin/users/users.component';
import { SettingsComponent } from '@src/app/_pages/_admin/settings/settings.component';
import { NavbarComponent } from '@src/app/_components/navbar/navbar.component';
import { SidebarComponent } from '@src/app/_components/sidebar/sidebar.component';
import { ToastComponent } from '@src/app/_components/toast/toast.component';
import { CoursesComponent } from '@src/app/_pages/courses/courses.component';
import { SelectUsersComponent } from '@src/app/_dialogs/select-users/select-users.component';
import { CourseComponent } from '@src/app/_pages/course/course.component';
import { FullPageLoadingComponent } from '@src/app/_components/full-page-loading/full-page-loading.component';
import { ChatComponent } from '@src/app/_pages/chat/chat.component';
import { JwtInterceptor } from '@src/app/_interceptors/jwt.interceptor';
import { ErrorInterceptor } from '@src/app/_interceptors/error.interceptor';
import { HideActionBarDirective } from '@src/app/_directives/hideActionBar.directive';
import { AssignmentItemComponent } from '@src/app/_components/assignment-item/assignment-item.component';
import { AssignmentComponent } from '@src/app/_pages/assignment/assignment.component';
import { HtmlToTextPipe } from '@src/app/_pipes/html-to-text.pipe';
import { NativescriptSquirrelChatUiComponent } from '@src/app/_components/nativescript-squirrel-chat-ui/nativescript-squirrel-chat-ui.component';
import { FileListComponent } from '@src/app/_components/file-list/file-list.component';
import { FileIconComponent } from '@src/app/_components/file-icon/file-icon.component';
import { EditDocumentComponent } from '@src/app/_pages/edit-document/edit-document.component';
import { AvatarComponent } from '@src/app/_components/avatar/avatar.component';

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
