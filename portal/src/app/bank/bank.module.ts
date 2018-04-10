import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { BankRoutingModule } from './bank-routing.module';
import { BankComponent } from './bank.component';
import { BankService } from './bank.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    BankRoutingModule
  ],
  declarations: [BankComponent],
  providers: [BankService]
})
export class BankModule { }
