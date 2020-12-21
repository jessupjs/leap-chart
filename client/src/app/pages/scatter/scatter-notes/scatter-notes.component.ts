import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-scatter-notes',
  templateUrl: './scatter-notes.component.html',
  styleUrls: ['./scatter-notes.component.scss']
})
export class ScatterNotesComponent implements OnInit {

  // Input, output
  @Input() components: any;

  // Class vars
  selected = null;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components['notes'].instance = this;

    // Init
    this.init();
  }

  /**
   *
   */
  init(): void {

    // ..
    this.wrangle();
  }

  /**
   *
   */
  wrangle(): void {

    // Find selected
    this.selected = this.components.views[this.components['main'].instance.selectedView];

    // ..
    this.render();
  }

  /**
   *
   */
  render(): void {

    // Detect changes
    this.changeDetector.detectChanges();
  }

}
