import {Component} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Classified} from '../../services/classified';

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
  viewProviders: [HTTP_PROVIDERS, ROUTER_DIRECTIVES]
})

export class HomeCmp {
  public classifieds;
  constructor(http: Http, private router: Router) {
    http.get('http://localhost:5000/classifieds')
      // Call map on the response observable to get the parsed people object
      .map(res => res.json())
      // Subscribe to the observable to get the parsed people object and attach it to the
      // component
      .subscribe(classifieds => this.classifieds = classifieds);
  }

  onSelect(classified: Classified) {
    this.router.navigate(['/ShowClassified', {id: classified._id.$oid}]);
  }
}
