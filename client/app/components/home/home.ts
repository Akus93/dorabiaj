import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';
import {CategoryService} from '../../services/category.service';


@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
  viewProviders: [HTTP_PROVIDERS],
  directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, MATERIAL_DIRECTIVES],
  providers: [ClassifiedService, CategoryService]
})
export class HomeCmp implements OnInit {

  public classifieds: Classified[];
  public error: string;
  public searchedCity: string;
  public searchedCategory: string;
  public categories: any;

  constructor(private router: Router, private _classifiedService: ClassifiedService,
              private _categoryService: CategoryService) {}

  ngOnInit() {
    this._classifiedService.getAllClassifieds()
      .subscribe(
        results => this.checkResponse(results));

    this._categoryService.getCategories()
      .subscribe(
        results => this.setCategories(results)
      );
  }

  checkResponse(res) {
      if (res.hasOwnProperty('error')) {
        this.error = res.error;
      } else {
        this.classifieds = res;
      }
    }

  setCategories(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this.categories = res;
    }
  }

  onSelect(classified: Classified) {
    this.router.navigate(['/ShowClassified', {id: classified._id.$oid}]);
  }

  search() {
    this.router.navigate(['Search', {city: this.searchedCity, category: this.searchedCategory}]);
  }
}
