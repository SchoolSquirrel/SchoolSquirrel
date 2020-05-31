import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { User } from "../_models/User";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
  public currentUser: User;

  constructor(private http: HttpClient) {}

  public login(domain: string, username: string, password: string) {
      return this.http
          .post<any>(
              `${domain}/auth/login`,
              { password, username },
          )
          .pipe(
              map((user) => {
                  // login successful if there's a jwt token in the response
                  if (user) {
                      this.currentUser = user;
                  }

                  return user;
              }),
          );
  }

  public logout() {
      // ToDo
  }
}
