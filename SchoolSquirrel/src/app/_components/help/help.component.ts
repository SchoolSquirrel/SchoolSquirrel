import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '@src/app/_services/authentication.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
    @Input() docs: string = "";
    @Input() white: boolean = false;    
    @Input() large: boolean = false;    

    constructor(private authenticationService: AuthenticationService) { }

    public getDocsLink(): string {
        console.log(this.docs);
        return `https://schoolsquirrel.github.io/SchoolSquirrel/${this.docs.replace("userrole", (this.authenticationService.currentUser?.role || "student") + "s")}`
    }
}
