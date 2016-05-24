import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'show-classified',
  templateUrl: './components/showClassified/showClassified.html',
  styleUrls: ['./components/showClassified/showClassified.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [ClassifiedService]
})
export class ShowClassifiedCmp implements OnInit {

  public classified: Classified;
  public error: string;
  public offerError:string;
  public offerPrice: number;
  public addOfferShow = false;
  private _id: string;

  constructor(private _params: RouteParams, private _classifiedService: ClassifiedService, public router: Router) {
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

  addOffer() {
    this._classifiedService.addOffer(this.classified._id.$oid, this.offerPrice)
      .subscribe(
        result => this.checkOfferResponse(result));
  }

  changeAddOfferShow() {
    this.addOfferShow = !this.addOfferShow;
  }

  checkResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.error = res.error;
        //this._router.navigate(['Home']);
      } else {
        this.classified = res;
      }
    }

  checkOfferResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.offerError = res.error;
      } else {
        this.router.navigate(['Home']);
      }
    }
}
