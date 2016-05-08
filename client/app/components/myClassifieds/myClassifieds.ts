import {Component, OnInit} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
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
export class MyClassifiedsCmp implements OnInit{

  public classifieds: Classified[];
  public error: string;

  constructor(private http: Http, private router: Router, private _classifiedService: ClassifiedService) {}

  ngOnInit() {
    this._classifiedService.getMyClassifieds()
      .subscribe(
        results => this.checkResponse(results));
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

  deleteClassified(classified: Classified) {
    let deleteString = 'http://localhost:5000/classified/'+classified._id.$oid;
    this.http
      .delete(deleteString)
      .subscribe(
        response => this.router.navigate(['Home'])
      );
  }
}
