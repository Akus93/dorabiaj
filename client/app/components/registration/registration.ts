import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {Headers, RequestOptions, HTTP_PROVIDERS} from 'angular2/http';


@Component({
  selector: 'registration',
  templateUrl: './components/registration/registration.html',
  styleUrls: ['./components/registration/registration.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  providers: [HTTP_PROVIDERS]
})
export class RegistrationCmp {
  public username: string;
  public email: string;
  public password: string;
  public password2: string;
  public city: string;
  public first_name: string;
  public last_name: string;


  validate() {
    return true;
  }

  signup() {
    console.log(this.username);
  }
}


