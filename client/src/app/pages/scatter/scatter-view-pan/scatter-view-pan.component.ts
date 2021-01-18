import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LeapEventsService} from "../leap-events.service";
import * as d3 from 'd3';

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
    duration: 1500,
    inputR: [0, 100],
    inputX: [35, 65],
    inputY: [35, 65],
    outputR: [0, 5],
    unitX: 'Column',
    unitY: 'Row',
    unitR: 'Evilness'
  };
  frame = null;
  modes = {
    'grab': false,
    'gesture': ''
  }
  scalesetG: {};

  // Setup tasks
  scalesetCreated = false;
  focusFingersDefined = false;
  gPointersCreated = false;

  // D3
  configs = {
    hoverX: 0,
    hoverY: 0
  };

  // Add class svg name specific to gesture
  className = 'pan';

  constructor(
    private leapEventsService: LeapEventsService
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['pan'].instance = this;

    // Update scatter board active component
    this.components['board'].instance.activeComponent = this;

    // Set controller
    this.controller = this.components['board'].instance.controller;

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

    const collection = [];

    for (let i = 10; i <= 90; i++) {

      for (let j = 0; j < 10; j++) {

        collection.push({
          name: '',
          x: Math.random() * 10 - 5 + i,
          y: Math.random() * 10 - 5 + i,
          r: Math.random() * 10 + 1,
        });
      }
    }

    return collection;
  }

  /**
   * onFrame
   */
  onFrame(frame: any): void {

    const vis = this;

    // Set scales if not set
    if (!this.scalesetCreated) {
      vis.scalesetG = vis.leapEventsService.generateScaleset(frame, vis.child.els.g.node())
      this.scalesetCreated = true;
    }

    if (!this.focusFingersDefined) {
      vis.leapEventsService.setFocusFingers(['Index']);
      let focusFingersDefined = true;
    }

    if (!this.gPointersCreated) {
      vis.leapEventsService.generateContainerPointers(vis.child.els.pointersG, vis.child.configs.pointerCircR);
      let gPointersCreated = true;
    }

    // Hover
    if (frame.fingers.length > 0) {

      // Update frame
      vis.frame = frame;

      // Get coords (index finger)
      const fingerCoords = vis.leapEventsService.getScaledFingersCoords(frame, vis.scalesetG);
      const indexFinger = fingerCoords.find(f => f.name === 'Index');
      vis.configs.hoverX = indexFinger.x;
      vis.configs.hoverY = indexFinger.y;

      // Update finger circs / pointers
      vis.leapEventsService.updateContainerPointers(fingerCoords, vis.child.els.pointersG);
    }

    // Grab status
    const handState = vis.leapEventsService.getHandStateFromHistory(frame, vis.controller, 10);

    // Trigger Grab
    vis.manageGrab(handState)

  }

  /**
  *
  */
  setChild(e: any): void {
    this.child = e;
  }

  /**
  *
  */
  manageGrab(gesture): void {

    // if (gesture !== this.modes.gesture) {

      // this.modes.gesture = gesture;

      if (gesture === 'closed') {

        this.modes.grab = true;

        // Check sub selections
        const invX = this.child.tools.scX.invert(this.configs.hoverX);
        const invY = this.child.tools.scY.invert(this.configs.hoverY);


        this.child.els.bubblesG
          .attr('transform', `translate(${this.configs.hoverX}, ${this.configs.hoverY})`);

        
      } else if (gesture === 'open') {

        this.modes.grab = false;
      }    


    // }
  }
}
