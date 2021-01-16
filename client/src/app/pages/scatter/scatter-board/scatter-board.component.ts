import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as Leap from 'leapjs';

@Component({
  selector: 'app-scatter-board',
  templateUrl: './scatter-board.component.html',
  styleUrls: ['./scatter-board.component.scss']
})
export class ScatterBoardComponent implements OnInit, AfterViewInit {

  // Input, output
  @Input() components: any;

  // Class vars
  activeComponent = null;
  controller = null;
  viewsKeys = [];

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components['board'].instance = this;

    // Add Controller
    this.controller = Leap.loop({enableGestures: true}, frame => this.manageLoop(frame));

  }

  ngAfterViewInit() {
    this.init();
  }

  /**
   * init
   */
  init(): void {
    this.wrangle();
  }

  /**
   * wrangle
   */
  wrangle(): void {
    this.render();
  }

  /**
   * render
   */
  render(): void {
    this.changeDetector.detectChanges();
  }

  /**
   * manageLoop
   */
  manageLoop(frame: any): void {

    if (this.activeComponent) {
      this.activeComponent.onFrame(frame);
    }

  }

  /**
   * setActiveComponent
   */
  setActiveComponent(): void {

  }

}
