import {Injectable}     from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import {User} from './user';

@Injectable()
export class UserService {

  constructor (private http: Http) {}

  private _userUrl = 'http://localhost:5000/user/';


  getUser(username :string): Observable<User> {
    return this.http.get(this._userUrl + username)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getMyUser(): Observable<User> {
    return this.http.get('http://localhost:5000/myuser')
      .map(this.extractData)
      .catch(this.handleError);
  }

  changeMyUser(user): Observable<JSON> {
    var body = 'first_name=' + user['first_name'] + '&last_name=' + user['last_name'] +
      '&city=' + user['city'] + '&interest=' + user['interest'];

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post('http://localhost:5000/changeMyUser', body, {headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  addOpinion(opinion, classifiedId): Observable<JSON> {
    var body = 'classifiedId=' + classifiedId + '&description=' + opinion['description'] +
      '&rank=' + opinion['rank'];

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post('http://localhost:5000/opinion', body, {headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  changePassword(password): Observable<JSON> {
    var body = 'oldpassword=' + password['oldpassword'] + '&password=' + password['password']
      + '&confirmpassword=' + password['confirmpassword'];

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post('http://localhost:5000/myuser/password', body, {headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body || { };
  }

  private handleError (error: any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }






  /*public _user: Response;

  public getUser(username: string) {
    this.http.get(this._userUrl + username)
        .subscribe(
        user => this.setUser(user),
        error => this.handleError(error));
    console.log('ania1');
    console.log(this._user);
    console.log('ania2');
    return this._user.json();
  }

  private setUser(user: Response) {
    console.log('ania3');
    console.log(user);
    console.log('ania4');
    this._user = user;
    console.log('ania5');

  }

  private handleError (error: any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg);
    /*return Observable.throw(errMsg);*/
  //}
}
