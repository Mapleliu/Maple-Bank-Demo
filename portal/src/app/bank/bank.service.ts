import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';


@Injectable()
export class BankService {

  constructor(private http: Http) { }

  	public uploadCustomerList(payload: any, bank: any){
  		let url = "/"+bank+"/userdetails";
		return  this.http.post(url, payload)
			.map(response => {
				const blocks = response;
				console.log(response);
				return blocks;
			})
			.catch(() => ("Error"));
	}



	private handleError (error: Response | any) {
	  console.log('ApiService::handleError', error);
	  return Observable.throw(error);
	}
}
