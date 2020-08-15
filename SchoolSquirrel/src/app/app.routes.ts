import { Routes } from "@angular/router";

import { HomeComponent } from "./_pages/home/home.component";
import { LoginComponent } from "./_pages/login/login.component";
import { AuthenticationGuard } from "./_guards/authentication.guard";
import { AssignmentsComponent } from "./_pages/assignments/assignments.component";
import { CalendarComponent } from "./_pages/calendar/calendar.component";
import { UsersComponent } from "./_pages/_admin/users/users.component";
import { SettingsComponent } from "./_pages/_admin/settings/settings.component";
import { AdminGuard } from "./_guards/admin.guard";
import { TeacherGuard } from "./_guards/teacher.guard";
import { CoursesComponent } from "./_pages/courses/courses.component";
import { CourseComponent } from "./_pages/course/course.component";
import { ChatComponent } from "./_pages/chat/chat.component";
import { AssignmentComponent } from "./_pages/assignment/assignment.component";
import { EditDocumentComponent } from "./_pages/edit-document/edit-document.component";

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
        path: "assignments/:id",
        component: AssignmentComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "assignments/:id/:tab",
        component: AssignmentComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "calendar",
        component: CalendarComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "courses",
        component: CoursesComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "courses/new",
        component: CoursesComponent,
        canActivate: [AuthenticationGuard, TeacherGuard],
    },
    {
        path: "courses/:id",
        component: CourseComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "courses/:id/:tab",
        component: CourseComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "chat",
        component: ChatComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "chat/user/:id",
        component: ChatComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "chat/:id",
        component: ChatComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: "document/:action/:type/:id",
        component: EditDocumentComponent,
        canActivate: [AuthenticationGuard],
        children: [
            {
                path: "**",
                component: EditDocumentComponent,
                canActivate: [AuthenticationGuard],
            },
        ],
    },

    /* *** Admin routes *** */
    {
        path: "admin/users",
        component: UsersComponent,
        canActivate: [AuthenticationGuard, AdminGuard],
    },
    {
        path: "admin/settings",
        component: SettingsComponent,
        canActivate: [AuthenticationGuard, AdminGuard],
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
