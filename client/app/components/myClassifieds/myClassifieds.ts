import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Classified, Offer} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'my-classified',
  templateUrl: './components/myClassifieds/myClassifieds.html',
  styleUrls: ['./components/myClassifieds/myClassifieds.css'],
  directives: [ROUTER_DIRECTIVES],
  viewProviders: [ROUTER_DIRECTIVES],
  providers: [ClassifiedService]
})
export class MyClassifiedsCmp implements OnInit {

  public classifieds: Classified[];
  public error: string;
  public offerError:string;

    constructor(public router: Router, private _classifiedService: ClassifiedService) {}

  ngOnInit() {
    this._classifiedService.getMyClassifieds()
      .subscribe(
        results => this.checkResponse(results));
  }

  deleteClassified(classified: Classified) {
    this._classifiedService.deleteClassified(classified._id.$oid)
    .subscribe(
      response => this.checkDeleteResponse(response)
    );
  }

  checkDeleteResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.error = res.error;
      } else {
        this.router.navigate(['Home']);
      }
    }


  checkResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.error = res.error;
        //this._router.navigate(['Home']);
      } else {
        this.classifieds = res;
      }
    }

  onSelect(classified: Classified) {
    this.router.navigate(['/ShowClassified', {id: classified._id.$oid}]);
  }

  edit(classified: Classified) {
    this.router.navigate(['/EditClassified', {id: classified._id.$oid}]);
  }

  selectOffer(classified: Classified, user: string) {
    this._classifiedService.selectOffer(classified, user)
      .subscribe(
        response => this.selectOfferResponse(response)
      );
    this.ngOnInit();
  }
    selectOfferResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.offerError = res.error;
        //this._router.navigate(['Home']);
      } else {
        alert('Wybrano!');
      }
    }

  pay(classified, user) {
    this._classifiedService.pay(classified, user)
      .subscribe(
        response => this.payResponse(response, classified)
      );
    this.ngOnInit();
  }

  payResponse(res, classified) {
    if (res.hasOwnProperty('error')) {
      alert(res.error);
      //this._router.navigate(['Home']);
    } else {
      alert('Zapłacono!');
      this.router.navigate(['/NewOpinion', {id: classified._id.$oid}]);
    }
  }


}
