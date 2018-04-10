import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { I18nService } from '../core/i18n.service';
import { AuthenticationService } from '../core/authentication/authentication.service';

import * as bankList from '../mock-data/banklist.json';

const log = new Logger('Login');
const BANKS = bankList.banks;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = environment.version;
  error: string = null;
  loginBankForm: FormGroup;
  loginCustomerForm: FormGroup;
  isLoading = false;
  selectedBank : Object;
  banks : Object[] = BANKS;
  loginType: string = 'bank';

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService) {
    this.createBankForm();
    this.createCustomerForm();
  }

  ngOnInit() { }

  bankLogin() {
    this.isLoading = true;
    console.log(this.loginBankForm.value);
    this.authenticationService.login(this.loginBankForm.value)
      .finally(() => {
        this.loginBankForm.markAsPristine();
        this.isLoading = false;
      })
      .subscribe(credentials => {
        log.debug(`${credentials.username} successfully logged in`);
        console.log("Logged in as : ", this.loginType);
        console.log("Selected bank:",this.selectedBank);
        this.router.navigate(['bank', credentials], { replaceUrl: true});
      }, error => {
        log.debug(`Login error: ${error}`);
        this.error = error;
      });
  }
  customerLogin() {
    this.isLoading = true;
    console.log(this.loginCustomerForm.value);
    this.authenticationService.login(this.loginCustomerForm.value)
      .finally(() => {
        this.loginCustomerForm.markAsPristine();
        this.isLoading = false;
      })
      .subscribe(credentials => {
        log.debug(`${credentials.username} successfully logged in`);
        this.router.navigate(['customer', credentials], { replaceUrl: true });
      }, error => {
        log.debug(`Login error: ${error}`);
        this.error = error;
      });
  }


  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  selectLogin(type: string){
    this.loginType = type;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createBankForm() {
    this.loginBankForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      bank:['', Validators.required],
      remember: true
    });
  }
  private createCustomerForm() {
    this.loginCustomerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }

}
