import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { CustomerComponent } from './customer.component';

const routes: Routes = Route.withShell([
  /*{ path: '', redirectTo: '/customer', pathMatch: 'full' },*/
  { path: 'customer', component: CustomerComponent, data: { title: extract('Customer') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CustomerRoutingModule { }
