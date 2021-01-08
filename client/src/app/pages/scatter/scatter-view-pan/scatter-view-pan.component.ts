import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LeapEventsService} from "../leap-events.service";

@Component({
  selector: 'app-scatter-view-pan',
  templateUrl: './scatter-view-pan.component.html',
  styleUrls: ['./scatter-view-pan.component.scss']
})
export class ScatterViewPanComponent implements OnInit {

  // Input, output
  @Input() components: any;

  // HTML
  @ViewChild('leap', {static: true}) leap: ElementRef;

  // Class vars (shared)
  child = null;
  controller = null;
  data = [];
  dataConfigs = {
    inputR: [0, 100],
    inputX: [0, 100],
    inputY: [0, 100],
    outputR: [0, 30],
    unitX: 'Column',
    unitY: 'Row',
    unitR: 'Evilness'
  };
  frame = null;
  scalesetG: {};

  constructor(
    private leapEventsService: LeapEventsService
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['pan'].instance = this;

    // Get data
    this.data = this.getData();
  }

  /**
   * addEvents
   */
  addEvents(): void {

    // This vis
    const vis = this;
  }

  /**
   * getData
   */
  getData(): any[] {
    return []
  }

  /**
   *
   */
  setChild(e: any): void {
    this.child = e;
  }

}