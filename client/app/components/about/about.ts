import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
  selector: 'about',
  templateUrl: './components/about/about.html',
  styleUrls: ['./components/about/about.css'],
  directives: [MATERIAL_DIRECTIVES, CORE_DIRECTIVES],
  providers: []
})
export class AboutCmp {

  constructor() { }

}
