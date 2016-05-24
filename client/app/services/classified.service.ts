import {Injectable}     from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';
import {Classified} from './classified';



@Injectable()
export class ClassifiedService {

  constructor (private http: Http) {}

  private _domain = 'http://localhost:5000/';


  getSearchResults(city: string, category: string): Observable<JSON> {
    return this.http.get(this._domain + 'search/' + city + '/' + category)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getClassified(id: string): Observable<JSON> {
    return this.http.get(this._domain + 'classified/' + id)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  getMyClassifieds(): Observable<JSON> {
    return this.http.get(this._domain + 'myclassifieds')
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  getAllClassifieds(): Observable<JSON> {
    return this.http.get(this._domain + 'classifieds')
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  createClassified(classified: Classified): Observable<JSON> {

    var body = 'title=' + classified.title + '&description=' + classified.description + '&budget='
      + classified.budget + '&city=' + classified.city + '&province=' + classified.province
      + '&category=' + classified.category + '&begin_date=' + classified.begin_date
      + '&end_date=' + classified.end_date + '&phone=' + classified.phone;

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this._domain + 'classified', body, {headers: headers})
            .map(this.extractData)
            .catch(this.handleError);
  }

  deleteClassified(id: string): Observable<JSON> {
    return this.http.delete(this._domain + 'classified/'+ id)
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  addOffer(classifiedId: string, price: number): Observable<JSON> {

    var body = 'classifiedId=' + classifiedId + '&price=' + price;

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this._domain + 'offer/add', body, {headers: headers})
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
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
