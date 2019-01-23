import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  constructor(
  	private http: Http
  ) { }

  private extractData(res:Response){
    return res;
  }

  private handleErrorObservable (error: Response | any) {
    return Observable.throw(error.message || error);
  }

  fetchJsonData() {    
  	return this.http.get('Users/riyakhandelwal/Angular2Test/assignment-planetworx/src/appcarsdetails.json')
          .map(this.extractData)
          .catch(this.handleErrorObservable);
  }
  postDataToJson(data){
  	return this.http.post('./carsdetails.json',data)
          .map(this.extractData)
          .catch(this.handleErrorObservable);
  }

}
