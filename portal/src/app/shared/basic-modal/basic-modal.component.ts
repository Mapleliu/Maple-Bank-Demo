import {Component, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-basic-modal',
  templateUrl: './basic-modal.component.html',
  styleUrls: ['./basic-modal.component.scss']
})
export class BasicModalComponent {
    modalOk:string = this.translateService.instant('common.ok');
    @Input() content:any;
    constructor(public activeModal: NgbActiveModal, private translateService: TranslateService, private i18nService: I18nService) {}
}
