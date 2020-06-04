import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { User } from "../_models/User";
import { RemoteService } from "./remote.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
  public currentUser: User;

  constructor(private remoteService: RemoteService) {}

  public login(username: string, password: string): Observable<any> {
      return this.remoteService.post("auth/login", { password, username }).pipe(
          map((user) => {
              // login successful if there's a jwt token in the response
              if (user) {
                  this.currentUser = user;
              }

              return user;
          }),
      );
  }

  public logout(): void {
      // ToDo
  }
}
