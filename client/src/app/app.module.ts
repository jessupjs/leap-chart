import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
import { HeaderComponent } from './mods/header/header.component';
import { BubblesComponent } from './pages/bubbles/bubbles.component';
import { ScatterComponent } from './pages/scatter/scatter.component';
import { ScatterNavComponent } from './pages/scatter/scatter-nav/scatter-nav.component';
import { ScatterBoardComponent } from './pages/scatter/scatter-board/scatter-board.component';
import { ScatterNotesComponent } from './pages/scatter/scatter-notes/scatter-notes.component';
import { ScatterPlotComponent } from './pages/scatter/scatter-plot/scatter-plot.component';
import { ScatterViewSelectComponent } from './pages/scatter/scatter-view-select/scatter-view-select.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    HeaderComponent,
    BubblesComponent,
    ScatterComponent,
    ScatterNavComponent,
    ScatterBoardComponent,
    ScatterNotesComponent,
    ScatterPlotComponent,
    ScatterViewSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
