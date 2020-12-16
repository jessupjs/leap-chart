import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from "./pages/index/index.component";
import {BubblesComponent} from "./pages/bubbles/bubbles.component";

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'bubbles', component: BubblesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
