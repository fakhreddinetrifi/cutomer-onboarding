import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FomrsComponent} from './components/fomrs/fomrs.component';

const routes: Routes = [
  {path: '', component: FomrsComponent},
  {path: ':id', component: FomrsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
