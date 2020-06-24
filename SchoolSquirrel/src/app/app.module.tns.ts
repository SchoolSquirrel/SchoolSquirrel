import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpClientModule } from "@nativescript/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
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
import { SelectUsersComponent } from "./_components/select-users/select-users.component";
import { FullPageLoadingComponent } from "./_components/full-page-loading/full-page-loading.component";

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
        FullPageLoadingComponent,
    ],
    imports: [
        ReactiveFormsModule,
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        TranslateModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
