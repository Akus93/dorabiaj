import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';


@Component({
  selector: 'show-classified',
  templateUrl: './components/showClassified/showClassified.html',
  styleUrls: ['./components/showClassified/showClassified.css'],
  viewProviders: [HTTP_PROVIDERS],
  directives: [ROUTER_DIRECTIVES],
  providers: [ClassifiedService]
})
export class ShowClassifiedCmp implements OnInit {

  public classified: Classified;
  public error: string;
  public offerPrice: number;
  public addOfferShow = false;

  materials: Array<any> = [
    {'id': 1, 'name': 'Acrylic (Transparent)', 'quantity': '25', 'price': '$2.90'},
    {'id': 2, 'name': 'Plywood (Birch)', 'quantity': '50', 'price': '$1.25'},
    {'id': 3, 'name': 'Laminate (Gold on Blue)', 'quantity': '10', 'price': '$2.35'}
  ];

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
        result => this.checkResponse(result));
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
}
