import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { BasicModalComponent } from './basic-modal/basic-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoaderComponent,
    BasicModalComponent
  ],
  exports: [
    LoaderComponent,
    BasicModalComponent
  ]
})
export class SharedModule { }
