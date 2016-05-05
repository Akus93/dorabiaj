import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class CategoriesService {
  public categories;
  constructor(http: Http) {
    http.get('http://localhost:5000/categories')
      .map(res => res.json())
      .subscribe(categories => this.categories = categories);
  }

  public get() {
    return Promise.resolve(this.categories);
  }
}
