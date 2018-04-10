import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { BankComponent } from './bank.component';

const routes: Routes = Route.withShell([
  /*{ path: '', redirectTo: '/bank', pathMatch: 'full' },*/
  { path: 'bank', component: BankComponent, data: { title: extract('Bank') } }
]);


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
