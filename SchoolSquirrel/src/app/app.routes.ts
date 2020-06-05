import { Routes } from "@angular/router";

import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { AuthenticationGuard } from "./_guards/authentication.guard";

export const routes: Routes = [
    {
        path: "home",
        component: HomeComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "**",
        redirectTo: "/home",
    },
];
