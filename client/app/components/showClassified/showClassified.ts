import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'show-classified',
  templateUrl: './components/showClassified/showClassified.html',
  styleUrls: ['./components/showClassified/showClassified.css'],
  directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, MATERIAL_DIRECTIVES],
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
    this.getClassified(this._id);
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
        alert("Dodano ofertę");
        this.changeAddOfferShow();
      }
    }

  inappropriate(classified: Classified) {
    this._classifiedService.setInappropriate(classified._id.$oid)
      .subscribe(
        result => this.checkInappropriateResponse(result));
  }

  checkInappropriateResponse(res) {
    if (res.hasOwnProperty('error')) {
      this.offerError = res.error;
    } else {
      alert("Zgłoszono nieodpowiednia tresc do administracji.");
    }
  }
}
