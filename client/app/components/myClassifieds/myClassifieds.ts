import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'my-classified',
  templateUrl: './components/myClassifieds/myClassifieds.html',
  styleUrls: ['./components/myClassifieds/myClassifieds.css'],
  viewProviders: [HTTP_PROVIDERS, ROUTER_DIRECTIVES],
  providers: [ClassifiedService]
})
export class MyClassifiedsCmp implements OnInit {

  public classifieds: Classified[];
  public error: string;

  constructor(private router: Router, private _classifiedService: ClassifiedService) {}

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


}
