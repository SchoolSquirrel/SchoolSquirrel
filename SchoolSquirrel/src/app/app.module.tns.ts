import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpClientModule } from "@nativescript/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
