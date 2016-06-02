import {Component, OnInit} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'show-classified',
  templateUrl: './components/editClassified/editClassified.html',
  styleUrls: ['./components/editClassified/editClassified.css'],
  viewProviders: [ROUTER_DIRECTIVES],
  providers: [ClassifiedService]
})
export class EditClassifiedCmp implements OnInit {

  public classified: Classified;
  public error: string;

  private _id: string;

  constructor(private _params: RouteParams, private _classifiedService: ClassifiedService, private _router: Router) {
    this.classified = new Classified();
    this._id = _params.get('id');
  }

  ngOnInit() {
    this.getClassified(this._id);
  }

  getClassified(id: string) {
    this._classifiedService.getClassified(id)
      .subscribe(
        result => this.checkResponse(result));
  }

  checkResponse(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this.classified = res;
    }
  }

  checkResponseChenge(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this._router.navigate(['Home']);
    }
  }

  saveChanges() {
    this._classifiedService.changeClassified(this._id, this.classified)
      .subscribe(
        result => this.checkResponseChenge(result));
  }

  cancel() {
    this._router.navigate(['MyClassifieds']);
  }
}
