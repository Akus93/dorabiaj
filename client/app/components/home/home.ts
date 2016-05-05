import {Component} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
  viewProviders: [HTTP_PROVIDERS],
  directives: [ROUTER_DIRECTIVES]
})
export class HomeCmp {

  public classifieds;

  public searchedCity: string;
  public searchedCategory: string;

  public categories = ['Dom', 'Ogród',
    'Chałupnictwo', 'Dzieci',
    'Zwierzęta', 'Gastronomia',
    'Korepetycje', 'Naprawa'].map(function (category) {
    return {abbrev: category};
  });

  constructor(http: Http, private _router: Router) {
    http.get('http://localhost:5000/classifieds')
      .map(res => res.json())
      .subscribe(classifieds => this.classifieds = classifieds);
  }

  search() {
    console.log('Search!');
    this._router.navigate(['Search', {city: this.searchedCity, category: this.searchedCategory}]);
  }
}
