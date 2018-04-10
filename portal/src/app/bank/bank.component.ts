import 'rxjs/add/operator/finally';

import { Component, OnInit, OnDestroy, ElementRef, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { BankService } from './bank.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../core/i18n.service';
import { BasicModalComponent} from '../shared/basic-modal/basic-modal.component';


@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
	bank: any;
	bankId: any;
  	private sub: any;
  	form: FormGroup;
  	loading: boolean = false;
  	apiURL: string = environment.serverUrl;
  	blockchainData: any;

  	@ViewChild('fileInput') fileInput: ElementRef;
  	@ViewChild('uploadModal') uploadRef: TemplateRef<any>;

  	constructor(private route: ActivatedRoute,
  		private fb: FormBuilder,
  		private elRef:ElementRef,
  		private http: Http,
  		private bankService: BankService,
  		private modalService: NgbModal,
  		private translateService: TranslateService,
  		private i18nService: I18nService) {
  		this.createForm();
  	}

  	createForm() {
		this.form = this.fb.group({
			file: [null, Validators.required]
		});
	}

  	onFileChange(event: any) {
		if(event.target.files.length > 0) {
			let file = event.target.files[0];
			this.form.get('file').setValue(file);
			let fileName = event.target.files[0].name;
			this.elRef.nativeElement.querySelector('#file').setAttribute("title", fileName);
			this.elRef.nativeElement.querySelector('#singlebutton').disabled = false;
		}
	}

	private prepareSave(): any {
	    let input = new FormData();
	    input.append('file', this.form.get('file').value);
	    return input;
	}

	openModalMessage(header:any, content:any, clearText:boolean){
		let myModalRef = this.modalService.open(BasicModalComponent);
		myModalRef.componentInstance.header = header;
    	myModalRef.componentInstance.content = content;
    	myModalRef.result.then((data) => {
			 // on close
			if(clearText){
				this.clearFile();
			}
		}, (reason) => {
			  // on dismiss
		});
	}

	onSubmit() {
	    const formModel = this.prepareSave();
	    this.loading = true;
	    let file = this.form.get('file').value;
	    let fileExt = file.name.split('.');
	    fileExt = fileExt[fileExt.length - 1];
	    if(fileExt != 'csv'){
	    	this.loading = false;
	    	this.openModalMessage(this.translateService.instant('common.warning'),this.translateService.instant('bank.invalidFileUploadError'), false);
	    	return false;
	    }
	    let formData: FormData = new FormData();
	    formData.append('file', file, file.name);
		this.bankService.uploadCustomerList(formData, this.bankId).subscribe(data =>{
			this.blockchainData = data;
			console.log("uploaded data", this.blockchainData.status);
			this.loading = false;
			if(this.blockchainData.status===201){
				this.openModalMessage(this.translateService.instant('bank.uploadCSVFile'),this.translateService.instant('bank.fileUploadSuccess'), true);
			}
			else{
				this.openModalMessage(this.translateService.instant('bank.uploadCSVFile'),this.translateService.instant('bank.fileUploadError'), true);
			}
		});
	}

	selectFile(){
		this.elRef.nativeElement.querySelector('#file').click();
	}
	clearFile() {
		this.elRef.nativeElement.querySelector('#file').title = this.translateService.instant('bank.dragAndDropFile');
		this.elRef.nativeElement.querySelector('#file').value = "";
		this.elRef.nativeElement.querySelector('#singlebutton').disabled = true;
	}

  	ngOnInit() {
  		this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);
  		this.sub = this.route.params.subscribe(params => {
       	this.bank = params['name'];
       	this.bankId = params['username'];
       	// In a real app: dispatch action to load the details here.
       	console.log("Got the Bank details in the bank component:", this.bank);
    	});
  	}
  	ngOnDestroy(){
  		this.sub.unsubscribe();
  	}

}
