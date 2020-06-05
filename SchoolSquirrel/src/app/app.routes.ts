import { Routes } from "@angular/router";

import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { AuthenticationGuard } from "./_guards/authentication.guard";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";

export const routes: Routes = [
    {
        path: "home",
        component: HomeComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "assignments",
        component: AssignmentsComponent,
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
