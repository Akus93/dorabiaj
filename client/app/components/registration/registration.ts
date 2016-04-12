import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Headers, RequestOptions, HTTP_PROVIDERS, Http} from 'angular2/http';
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


  constructor(public http: Http) { }


  validate() {
    return true;
  }

  signup() {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:5000/ajax-post', JSON.stringify({"id": 1, "name": "Dawid"}),{headers:headers})
    .map(res => res.json())
    .subscribe(res => console.log(res));
 }



/*  signup() {
  this.http.get('http://localhost:5000/ajax')
    .map(res => res.text())
    .subscribe(
      data => console.log(data),
      err => this.logError(err),
      () => console.log('Random Quote Complete')
    );
  }

  logError(err) {
    console.error('There was an error: ' + err);
  }
*/
 /* signup() {
      var creds = 'username=' + this.username + '&password=' + this.password;

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post('http://localhost:5000/login', creds, {
        headers: headers
        })
        .map(res => res.json())
        .subscribe(
          data => console.log(data),
          err => console.log(err),
          () => console.log('Authentication Complete')
        );
  }*/

}


