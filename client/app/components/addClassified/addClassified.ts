import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {Router} from 'angular2/router';
import {CategoryService} from '../../services/category.service';
import {Classified} from '../../services/classified';
import {ClassifiedService} from '../../services/classified.service';


@Component({
  selector: 'add-classified',
  templateUrl: './components/addClassified/addClassified.html',
  styleUrls: ['./components/addClassified/addClassified.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  providers: [CategoryService, ClassifiedService]
})
export class AddClassifiedCmp implements OnInit {

  public categories;

  public classified: Classified;
  public error: string;

  constructor(public http: Http, private _router: Router, private _categoryService: CategoryService,
              private _classifiedService: ClassifiedService) {
    this.classified = new Classified();
  }

  ngOnInit() {
    this._categoryService.getCategories()
      .subscribe(
        results => this.setCategories(results)
      );
  }

  save() {
    this._classifiedService.createClassified(this.classified)
      .subscribe(
        results => this.checkResponse(results));
  }

  setCategories(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this.categories = res;
    }
  }

  checkResponse(res) {
    if (res.hasOwnProperty('error')) {
      this.error = res.error;
    } else {
      this._router.navigate(['Home']);
    }
  }

}
