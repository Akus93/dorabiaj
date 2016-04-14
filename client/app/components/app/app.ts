import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
// import {HTTP_PROVIDERS} from 'angular2/http';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {HomeCmp} from '../home/home';
import {AboutCmp} from '../about/about';
import {LoginCmp} from '../login/login';
import {RegistrationCmp} from '../registration/registration';


import {PeopleList} from '../../services/people_list';

@Component({
  selector: 'app',
  viewProviders: [PeopleList],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/login', component: LoginCmp, as: 'Login' },
  { path: '/registration', component: RegistrationCmp, as: 'Registration' }

])
export class AppCmp {

  logout() {
    sessionStorage.removeItem('login');
  }

  checkLogin() {
    var session = sessionStorage.getItem('login');
    if(session)
      return true;
    return false;
  }
}
