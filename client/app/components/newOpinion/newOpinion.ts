import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'new-opinion',
  templateUrl: './components/newOpinion/newOpinion.html',
  styleUrls: ['./components/newOpinion/newOpinion.css'],
  viewProviders: [ROUTER_DIRECTIVES],
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [UserService]
})
export class NewOpinionCmp implements OnInit {
  public error = {};
  private _id: string;
  public opinion = {
    description: '',
    rank: 1
  };
  public scale = [1, 2, 3, 4, 5];

  constructor(private _params: RouteParams, private _userService: UserService, private _router: Router) {
    this._id = _params.get('id');
  }

  ngOnInit() {

  }

  setOpinion() {
    this._userService.addOpinion(this.opinion, this._id)
      .subscribe(
        results => this.checkResponse(results));
  }

  checkResponse(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this._router.navigate(['Home']);
    }
  }

  cancel() {
    this._router.navigate(['Home']);
  }
}
