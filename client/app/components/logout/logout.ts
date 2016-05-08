import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {Router} from 'angular2/router';


@Component({
  selector: 'logout',
  templateUrl: './components/logout/logout.html',
  styleUrls: ['./components/logout/logout.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  providers: []
})
export class LogoutCmp {

  constructor(private http: Http, private router: Router) {
    this.logout();
  }

  check_response(response) {
    if (response.hasOwnProperty('success')) {
      sessionStorage.removeItem('login');
    } else {
      console.log('Błąd wylogowania');
    }
    this.router.navigate(['Home']);
  }

  logout() {

      this.http.get('http://localhost:5000/logout')
        .map(response => response.json())
        .subscribe(
          response => this.check_response(response)
        );
  }

}
