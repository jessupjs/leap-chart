import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from "./pages/index/index.component";
import {BubblesComponent} from "./pages/bubbles/bubbles.component";
import {ScatterComponent} from "./pages/scatter/scatter.component";

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'bubbles', component: BubblesComponent},
  {path: 'scatter', component: ScatterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
