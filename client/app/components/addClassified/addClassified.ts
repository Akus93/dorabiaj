import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Headers, Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {Router} from 'angular2/router';
import {CategoriesService} from '../../services/categories';

@Component({
  selector: 'addClassified',
  templateUrl: './components/addClassified/addClassified.html',
  styleUrls: ['./components/addClassified/addClassified.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
  providers: [CategoriesService]
})
export class AddClassifiedCmp {
  public categories2;
  constructor(public http: Http, private router: Router, private _categoriesService: CategoriesService) {
    this._categoriesService.get()
      .then(categories => this.categories2 = categories);
    console.log(this.categories2);
  }
  public classified = {
    title: '',
    description: '',
    budget: '',
    province: '',
    city: '',
    category: '',
    begin_date: '',
    end_date: '',
    phone: ''
  };

  public categories = ['Dom', 'Ogród',
    'Chałupnictwo', 'Dzieci',
    'Zwierzęta', 'Gastronomia',
    'Korepetycje', 'Naprawy'].map(function (category) {
    return {abbrev: category};
  });

  public error = {};

  save() {
    var body = 'title=' + this.classified.title + '&description=' + this.classified.description + '&budget='
      + this.classified.budget + '&city=' + this.classified.city + '&province=' + this.classified.province
      + '&category=' + this.classified.category + '&begin_date=' + this.classified.begin_date
      + '&end_date=' + this.classified.end_date + '&phone=' + this.classified.phone;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http
      .post('http://localhost:5000/classified',
        body, {
          headers: headers
        })
      .map(response => response.json())
      .subscribe(
        response => this.router.navigate(['Home'])
      );
  }
}
