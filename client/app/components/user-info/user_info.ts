import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';
import {UserService} from '../../services/user.service';
import {RouteParams} from 'angular2/router';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {User} from '../../services/user';


@Component({
  selector: 'user-info',
  templateUrl: './components/user-info/user_info.html',
  styleUrls: ['./components/user-info/user_info.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [UserService]
})
export class UserInfoCmp implements OnInit {

  public user :User;
  private username :string;

  constructor(private _userService: UserService, private params: RouteParams, public router: Router) {
    this.username = params.get('username');
    this.user = new User();
  }

  ngOnInit() {
    this.getUser(this.username);
  }

  getUser(username :string) {
    this._userService.getUser(username)
      .subscribe(
        user => this.checkResponse(user));
  }

  checkResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.router.navigate(['Home']);
      } else {
        this.user = res;
      }
    }

}
