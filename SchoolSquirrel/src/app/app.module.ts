import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
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
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
