import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';
import {Headers, Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {Router} from 'angular2/router';


@Component({
  selector: 'login',
  templateUrl: './components/login/login.html',
  styleUrls: ['./components/login/login.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  providers: []
})
export class LoginCmp {

  public data = {
    'username': '',
    'password': ''
  };

  public error: string;

  constructor(private http: Http) { }

  undefinedToNull() {
    for (var key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        if (!this.data[key])
          this.data[key] = '';
      }
    }
  }

  validate() {
    this.undefinedToNull();
    return true;
  }

  check_response(response) {
    if (response.hasOwnProperty('username')) {
      console.log(response);
    } else if (response.hasOwnProperty('error')) {
      this.error = response['error'];
      console.log(response);
    }
  }

  login() {
    this.error = '';
    if (this.validate()) {
      var body = 'username=' + this.data['username'] + '&password=' + this.data['password'];
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('http://localhost:5000/login',
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
