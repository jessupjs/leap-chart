import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-scatter-nav',
  templateUrl: './scatter-nav.component.html',
  styleUrls: ['./scatter-nav.component.scss']
})
export class ScatterNavComponent implements OnInit {

  // Input, output
  @Input() components: any;

  // Class vars
  selected = '';
  viewsKeys = [];

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    // Set nav in map
    this.components['nav'].instance = this;

    // Get keys
    this.viewsKeys = Object.keys(this.components.views);
  }

  /** 1.
   *
   */
  init(): void {

    // ..
    this.wrangle();
  }

  /** 2.
   *
   */
  wrangle(): void {

    // Selected
    this.selected = this.components['main'].instance.selectedView;

    // ..
    this.render();
  }

  /** 3.
   *
   */
  render(): void {

    // Detect changes
    this.changeDetector.detectChanges();
  }

  /**
   * clickView
   */
  clickView(e: Event, d: any) {
    this.components['main'].instance.setSelectedView(d);
  }

}
