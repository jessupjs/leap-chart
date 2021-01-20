import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LeapEventsService} from "../leap-events.service";

@Component({
  selector: 'app-scatter-view-swipe',
  templateUrl: './scatter-view-swipe.component.html',
  styleUrls: ['./scatter-view-swipe.component.scss']
})
export class ScatterViewSwipeComponent implements OnInit {

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
    hoverY: 0,
    offset: 15
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

    console.log('data-----', this.data)
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

      for (let j = 0; j < 20; j++) {

        collection.push({
          name: 'cat0',
          x: Math.random() * 10 - 5 + i,
          y: Math.random() * Math.floor(7) * 10 - 5 + i,
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

    // swipe direction
    const swipeDirection = vis.leapEventsService.getSwipeDirection(frame);

    // Trigger swipe
    vis.manageSwipe(swipeDirection)

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
  manageSwipe(direction): void {

    let xDomain = [];
    let yDomain = [];

  	const config = this.dataConfigs;
  	const offset = this.configs.offset;

  	if (direction === 'left direction') { 

      xDomain = [config.inputX[0] - offset, config.inputX[1] - offset];
      yDomain = [config.inputY[0] - offset, config.inputY[1] - offset];

      this.moveElements(xDomain, yDomain);

  	} else if (direction === 'right direction') { 

  		xDomain = [config.inputX[0] + offset, config.inputX[1] + offset];
  		yDomain = [config.inputY[0] + offset, config.inputY[1] + offset];

  		this.moveElements(xDomain, yDomain);
  	}
  }

  /**
  *
  */
  moveElements(xDomain, yDomain): void {

    // Update scales
    this.child.tools.scX.domain(xDomain);
    this.child.tools.scY.domain(yDomain);

    this.child.wrangle();
  }
}
