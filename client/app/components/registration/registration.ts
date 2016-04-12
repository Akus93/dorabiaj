import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Headers, HTTP_PROVIDERS, Http} from 'angular2/http';
import 'rxjs/add/operator/map';


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

  public user = {
    'username': '',
    'email': '',
    'password': '',
    'password2': '',
    'city': '',
    'first_name': '',
    'last_name': ''
  };

  constructor(public http: Http) { }


  undefinedToNull() {
    for (var key in this.user) {
      if (this.user.hasOwnProperty(key)) {
        if (!this.user[key])
          this.user[key] = '';
      }
    }
  }

  validate() {
    this.undefinedToNull();
    return true;
  }

  check_response(response) {
    if (response.hasOwnProperty('success')) {
      console.log('Success!');
    } else if (response.hasOwnProperty('error')) {
      console.log(response);
    }
  }

  signup() {
    if (this.validate()) {
      var body = 'username=' + this.user['username'] + '&email=' + this.user['email'] + '&password=' +
        this.user['password'] + '&password2=' + this.user['password2'] + '&city=' + this.user['city'] + '&first_name=' +
        this.user['first_name'] + '&last_name=' + this.user['last_name'];
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('http://localhost:5000/signup',
          body, {
            headers: headers
          })
        .map(response => response.json())
        .subscribe(
          response => this.check_response(response)
        );
    }
 }


}


