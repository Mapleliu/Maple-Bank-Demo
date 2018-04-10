import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as data from '../../mock-data/banklist.json'

const USERS = data;

export interface Credentials {
  // Customize received credentials here
  username: string;
  type: string;
  token: string;
}

export interface LoginContext {
  username: string;
  password: string;
  bank: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials;

  constructor() {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data = {
      username: '',
      type: '',
      token: '123456',
      name: ''
    };
    if(context.bank && context.bank != ""){
      let user:any, list = USERS.banks;
      for(user of list){
        if(context.username == user.user.userId && context.bank == user.id){
          data.username = user.user.userId;
          data.type = "bankAdmin";
          data.name = user.name;
        }
      }
    }else{
      let user:any, list = USERS.customer;
      for(user of list){
        if(context.username == user.userId){
          data.username = user.userId;
          data.type = "customer";
          data.name = user.name;
        }
      }
    }
    
    if(data.username != ""){
      this.setCredentials(data, context.remember);
    }
    return Observable.of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return Observable.of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

}
