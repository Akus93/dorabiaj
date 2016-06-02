import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';
import {UserService} from '../../services/user.service';
import {User} from '../../services/user';


@Component({
  selector: 'classifiedsForMe',
  templateUrl: './components/classifiedsForMe/classifiedsForMe.html',
  styleUrls: ['./components/classifiedsForMe/classifiedsForMe.css'],
  viewProviders: [HTTP_PROVIDERS],
  directives: [ROUTER_DIRECTIVES],
  providers: [UserService, ClassifiedService]
})
export class ClassifiedsForMeCmp implements OnInit {

  public classifieds: Classified[];
  public error: string;
  public user: User;

  constructor(private _userService: UserService, private router: Router, private _classifiedService: ClassifiedService) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this._userService.getMyUser()
      .subscribe(
        result => this.checkResponseUser(result));
  }

  checkResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.error = res.error;
      } else {
        this.classifieds = res;
      }
    }

  checkResponseUser(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this.user = res;
      this._classifiedService.getSearchResults(this.user.city, this.user.interests[0])
        .subscribe(
          results => this.checkResponse(results));
    }
  }

  onSelect(classified: Classified) {
    this.router.navigate(['/ShowClassified', {id: classified._id.$oid}]);
  }
}
