import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';


@Injectable()
export class CustomerService {

  constructor(private http: Http) { }

  public createAccount(account: any){
		return this.http.post("/createaccount", account)
			.map(response => {
				const status = response;
				console.log("Successfuly created account in service", status);
				return status;
			})
			.catch(() => ("Error Creating Account."));
	}
}
