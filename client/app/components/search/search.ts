import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';
import {RouteParams} from 'angular2/router';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {SearchService} from '../../services/search.service';
import {Classified} from '../../services/classified';


@Component({
  selector: 'search',
  templateUrl: './components/search/search.html',
  styleUrls: ['./components/search/search.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [SearchService]
})
export class SearchCmp implements OnInit {

  public results: Classified[];
  public error: string;
  private _city :string;
  private _category: string;


  constructor(private _searchService: SearchService, private params: RouteParams, private _router: Router) {
    this._city = params.get('city');
    this._category = params.get('category');
  }

  ngOnInit() {
    this.getSearchResults(this._city, this._category);
  }

  getSearchResults(city: string, category: string) {
    this._searchService.getSearchResults(city, category)
      .subscribe(
        results => this.checkResponse(results));
  }

  checkResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.error = res.error;
        //this._router.navigate(['Home']);
      } else {
        this.results = res;
      }
    }

}
