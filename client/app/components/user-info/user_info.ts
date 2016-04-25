import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';
import {UserService} from '../../services/user.service';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';


@Component({
  selector: 'user-info',
  templateUrl: './components/user-info/user_info.html',
  styleUrls: ['./components/user-info/user_info.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  providers: [UserService]
})
export class UserInfoCmp implements OnInit {

  public username: string;
  public email :string;
  public firstName :string;
  public lastName :string;
  public city :string;
  public tokens :string;
  public admin :boolean;

  constructor(private _userService: UserService, private params: RouteParams, private router: Router) {
    this.username = params.get('username');
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
        for (var prop in res)
          this[prop] = res[prop];
      }
    }

}
