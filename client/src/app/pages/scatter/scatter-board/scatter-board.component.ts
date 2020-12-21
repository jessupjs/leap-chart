import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-scatter-board',
  templateUrl: './scatter-board.component.html',
  styleUrls: ['./scatter-board.component.scss']
})
export class ScatterBoardComponent implements OnInit {

  // Input, output
  @Input() components: any;

  // Class vars
  viewsKeys = [];

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components['board'].instance = this;

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
