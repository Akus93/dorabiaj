import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {UserService} from '../../services/user.service';
import {User} from '../../services/user';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'edit-user',
  templateUrl: './components/editUser/editUser.html',
  styleUrls: ['./components/editUser/editUser.css'],
  viewProviders: [ROUTER_DIRECTIVES],
  providers: [UserService, CategoryService]
})
export class EditUserCmp implements OnInit {

  public user: User;
  public error = {};
  public categories;
  public password = {
    oldpassword: '',
    password: '',
    confirmpassword: ''
  };
  public user2 = {
    first_name: '',
    last_name: '',
    city: '',
    interest: ''
  };

  constructor(private _userService: UserService, private _router: Router, private _categoryService: CategoryService) {
    this.user = new User();
  }

  ngOnInit() {
    this.getUser();
    this._categoryService.getCategories()
      .subscribe(
        results => this.setCategories(results)
      );
  }

  getUser() {
    this._userService.getMyUser()
      .subscribe(
        result => this.checkResponse(result));
  }

  checkResponse(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this.user = res;
    }
  }

  changeUser() {
    this._userService.changeMyUser(this.user2)
      .subscribe(
        result => this.checkResponse(result));
  }

  changePassword() {
    this._userService.changePassword(this.password)
      .subscribe(
        result => this.checkResponse(result));
  }

  setCategories(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this.categories = res;
    }
  }

  cancel() {
    this._router.navigate(['Home']);
  }
}
