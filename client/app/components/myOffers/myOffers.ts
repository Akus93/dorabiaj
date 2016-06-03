import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Classified, Offer} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'my-offers',
  templateUrl: './components/myOffers/myOffers.html',
  styleUrls: ['./components/myOffers/myOffers.css'],
  directives: [ROUTER_DIRECTIVES],
  viewProviders: [ROUTER_DIRECTIVES],
  providers: [ClassifiedService]
})
export class MyOffersCmp implements OnInit {

  public acceptedClassifieds: Classified[];
  public unacceptedClassifieds: Classified[];
  public acceptedError: string;
  public unacceptedError: string;

  constructor(public router: Router, private _classifiedService: ClassifiedService) {}

  ngOnInit() {
    this._classifiedService.getMyAcceptedOffers()
      .subscribe(
        results => this.checkAcceptedResponse(results));

    this._classifiedService.getMyUnacceptedOffers()
      .subscribe(
        results => this.checkUnacceptedResponse(results));
  }

  checkAcceptedResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.acceptedError = res.error;
      } else {
        this.acceptedClassifieds = res;
      }
    }

    checkUnacceptedResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.unacceptedError = res.error;
      } else {
        this.unacceptedClassifieds = res;
      }
    }
}
