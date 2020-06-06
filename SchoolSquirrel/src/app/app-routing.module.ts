import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./app.routes";

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppRoutingModule { }
