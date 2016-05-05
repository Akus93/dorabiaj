import {Component} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Classified} from '../../services/classified';

@Component({
  selector: 'home',
  templateUrl: './components/showClassified/showClassified.html',
  styleUrls: ['./components/showClassified/showClassified.css'],
  viewProviders: [HTTP_PROVIDERS, ROUTER_DIRECTIVES]
})
export class ShowClassifiedCmp {
  id: string;
  public classified: Classified;
  constructor(http: Http, params: RouteParams) {
    this.classified = new Classified();
    this.id = params.get('id');
    http.get('http://localhost:5000/classified/'+this.id)
      // Call map on the response observable to get the parsed people object
      .map(res => res.json())
      // Subscribe to the observable to get the parsed people object and attach it to the
      // component
      .subscribe(classified => this.classified = classified);
  }
}
