import {Component} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
  viewProviders: [HTTP_PROVIDERS]
})
export class HomeCmp {
  public classifieds;
  constructor(http: Http) {
    http.get('http://localhost:5000/classifieds')
      // Call map on the response observable to get the parsed people object
      .map(res => res.json())
      // Subscribe to the observable to get the parsed people object and attach it to the
      // component
      .subscribe(classifieds => this.classifieds = classifieds);
  }
}
