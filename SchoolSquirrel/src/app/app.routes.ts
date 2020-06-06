import { Routes } from "@angular/router";

import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { AuthenticationGuard } from "./_guards/authentication.guard";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";
import { CalendarComponent } from "./_pages/calendar/calendar.component";
import { UsersComponent } from "./_pages/_admin/users/users.component";
import { SettingsComponent } from "./_pages/_admin/settings/settings.component";

export const routes: Routes = [
    /* *** Main routes *** */
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
        path: "calendar",
        component: CalendarComponent,
        canActivate: [AuthenticationGuard],
    },

    /* *** Admin routes *** */
    {
        path: "admin/users",
        component: UsersComponent,
    },
    {
        path: "admin/settings",
        component: SettingsComponent,
    },

    /* *** Authentication routes *** */
    {
        path: "login",
        component: LoginComponent,
    },

    /* *** Default routes *** */
    {
        path: "**",
        redirectTo: "/home",
    },
];
