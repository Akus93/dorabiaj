import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {FORM_DIRECTIVES} from 'angular2/common';

@Component({
  selector: 'login',
  templateUrl: './components/login/login.html',
  styleUrls: ['./components/login/login.css'],
  directives: [MATERIAL_DIRECTIVES, FORM_DIRECTIVES]
})
export class LoginCmp {}
