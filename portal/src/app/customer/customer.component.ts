import 'rxjs/add/operator/finally';

import { Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { I18nService } from '../core/i18n.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from './customer.service';
import * as bankList from '../mock-data/banklist.json';

const BANKS = bankList.banks;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
	bankList : Object[] = BANKS;
	customerDetails: any;
  createAccountForm: FormGroup;
  createAccdata: any;
  loading: boolean = false;
  payload: any;
  createError: boolean = false;
  createSuccess: boolean = false;
  //formSubmitDisable: boolean = true;
	private sub: any;
  hasTypeOneAcc: boolean = true;
  constructor(private route: ActivatedRoute, private elRef:ElementRef, private fb: FormBuilder, private i18nService: I18nService, private customerService: CustomerService) {
  	this.createForm();
  }

 /* checkValidForm(){
      if(this.hasTypeOneAcc){
          if(this.createAccountForm.controls.username.invalid || this.createAccountForm.controls.userid.invalid || this.createAccountForm.controls.mobilephone.invalid){
              this.formSubmitDisable = true;
          }
          else{
              this.formSubmitDisable = false;
          }
      }
  }*/

	onSubmit() {
	    const formModel = this.createAccountForm.value;
	    /*const formModel = this.prepareSave();*/
	    this.loading = true;
      this.payload={
        "type2AccountInfo": {
          "bank": formModel.bank,
          "username": formModel.username,
          "user_id": formModel.userid,
          "mobilenumber": formModel.mobilephone
        },
          "type1AccountInfo": {
          "bank": formModel.whichBank,
          "user_account": formModel.currentaccnumber
        }
      };
      console.log("This is the created Payload", this.payload);
      this.customerService.createAccount(this.payload).subscribe(data =>{
        this.createAccdata = data;
        console.log("Customer Account created",this.createAccdata);
        this.loading = false;
        if(this.createAccdata.status === 201){
          this.createError = false;
          this.createSuccess = true;
          console.log("Account created Succesfully!");
        }else{
          this.createSuccess = false;
          this.createError = true;
          console.log("User does not have privileged accouont.");
        }
      });
	}
  clearFile(){
    console.log("Cleared the form");
    this.createAccountForm.reset();
    var selectItems = this.elRef.nativeElement.getElementsByTagName("select");
    for(var i = 0; i < selectItems.length; i++) {
      selectItems[i].selectedIndex = 0;
    }
    this.elRef.nativeElement.querySelector('#accountSwitch').checked = false;
    this.hasTypeOneAcc = true;
    this.createError = false;
    this.createSuccess = false;
  }
  existing(){
      this.hasTypeOneAcc = !this.hasTypeOneAcc;
      /*if(!this.hasTypeOneAcc){
          this.formSubmitDisable = true;
      }
      else{
          this.formSubmitDisable = false;
      }*/
  }
  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
       	//this.bankList = params['name'];
       	/*this.customerDetails = params['credentials'];*/

       	// In a real app: dispatch action to load the details here.
       	console.log("Got the Bank List in the Customer component:", this.bankList);
    	});
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  private createForm() {
    this.createAccountForm = this.fb.group({
      username: ['', Validators.required],
      userid: ['', Validators.required],
      mobilephone: ['', Validators.required],
      bank: ['', Validators.required],
      whichBank: ['', Validators.required],
      currentaccnumber : ['', Validators.required]
    });
  }

}
