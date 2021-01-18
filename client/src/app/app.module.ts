import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
import { HeaderComponent } from './mods/header/header.component';
import { ScatterComponent } from './pages/scatter/scatter.component';
import { ScatterNavComponent } from './pages/scatter/scatter-nav/scatter-nav.component';
import { ScatterBoardComponent } from './pages/scatter/scatter-board/scatter-board.component';
import { ScatterNotesComponent } from './pages/scatter/scatter-notes/scatter-notes.component';
import { ScatterPlotComponent } from './pages/scatter/scatter-plot/scatter-plot.component';
import { ScatterViewSelectComponent } from './pages/scatter/scatter-view-select/scatter-view-select.component';
import { LeapMotionComponent } from './pages/scatter/leap-motion/leap-motion.component';
import { ScatterViewZoomComponent } from './pages/scatter/scatter-view-zoom/scatter-view-zoom.component';
import { ScatterViewPanComponent } from './pages/scatter/scatter-view-pan/scatter-view-pan.component';
import { ScatterViewLassoComponent } from './pages/scatter/scatter-view-lasso/scatter-view-lasso.component';
import { ScatterViewFilterComponent } from './pages/scatter/scatter-view-filter/scatter-view-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    HeaderComponent,
    ScatterComponent,
    ScatterNavComponent,
    ScatterBoardComponent,
    ScatterNotesComponent,
    ScatterPlotComponent,
    ScatterViewSelectComponent,
    LeapMotionComponent,
    ScatterViewZoomComponent,
    ScatterViewPanComponent,
    ScatterViewLassoComponent,
    ScatterViewFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
