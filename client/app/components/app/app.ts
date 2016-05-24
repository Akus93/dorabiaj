import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {HomeCmp} from '../home/home';
import {LoginCmp} from '../login/login';
import {RegistrationCmp} from '../registration/registration';
import {AddClassifiedCmp} from '../addClassified/addClassified';
import {UserInfoCmp} from '../user-info/user_info';
import {ShowClassifiedCmp} from '../showClassified/showClassified';
import {MyClassifiedsCmp} from '../myClassifieds/myClassifieds';
import {SearchCmp} from '../search/search';
import {LogoutCmp} from '../logout/logout';
import {EditClassifiedCmp} from '../editClassified/editClassified';


@Component({
  selector: 'app',
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/add-classified', component: AddClassifiedCmp, as: 'AddClassified' },
  { path: '/login', component: LoginCmp, as: 'Login' },
  { path: '/logout', component: LogoutCmp, as: 'Logout' },
  { path: '/registration', component: RegistrationCmp, as: 'Registration' },
  { path: '/user/:username', component: UserInfoCmp, name: 'UserInfo'},
  { path: '/search/:city/:category', component: SearchCmp, name: 'Search'},
  { path: '/classified/:id', component: ShowClassifiedCmp, as: 'ShowClassified'},
  { path: '/edit-classified/:id', component: EditClassifiedCmp, as: 'EditClassified'},
  { path: '/my-classifieds', component: MyClassifiedsCmp, as: 'MyClassifieds'}

])
export class AppCmp {

  checkLogin() {
    var session = sessionStorage.getItem('login');
    if(session)
      return true;
    return false;
  }
}
