import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LeapEventsService} from '../leap-events.service';
import * as d3 from 'd3';


@Component({
  selector: 'app-scatter-view-zoom',
  templateUrl: './scatter-view-zoom.component.html',
  styleUrls: ['./scatter-view-zoom.component.scss']
})
export class ScatterViewZoomComponent implements OnInit, AfterViewInit {

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
    inputX: [0, 100],
    inputY: [0, 100],
    outputR: [0, 5],
    unitX: 'Column',
    unitY: 'Row',
    unitR: 'Evilness'
  };
  frame = null;
  modes = {
    zoomed: false,
    gesture: ''
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
  els = {
    bubblesG: null,
    svg: null
  };
  tools = {
    zoom: null
  };

  // Add class svg name specific to gesture
  className = 'zoom';

  // Gesture
  gestures = []

  constructor(
    private leapEventsService: LeapEventsService
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['zoom'].instance = this;

    // Update scatter board active component
    this.components['board'].instance.activeComponent = this;

    // Set controller
    this.controller = this.components['board'].instance.controller;

    // Get data
    this.data = this.getData();
  }

  ngAfterViewInit() {

    // Color target
    this.colorTarget();
  }

  /**
   * addEvents
   */
  addEvents(): void {

  }

  /**
   * colorTarget
   */
  colorTarget(): void {
    this.child.els.bubblesG.selectAll('circle')
      .each(function(d, i) {
        if (d.name === 'Badubada') {
          d3.select(this)
            .attr('fill', 'rgba(255, 0, 0, 1)')
        }
      })
  }

  /**
   * getData
   */
  getData(): any[] {

    const vis = this;

    let collection = [];

    const rands1 = 100;
    for (let i = 0; i < rands1; i++) {
      collection.push({
        name: '',
        x: Math.random() * this.dataConfigs.inputX[1],
        y: Math.random() * this.dataConfigs.inputY[1],
        r: Math.random() * this.dataConfigs.inputR[1] * 0.1,
      });
    }

    function createCluster(pos, range, rands) {
      for (let i = 0; i < rands; i++) {
        const w = range[0] * 2;
        const h = range[1] * 2;
        const obj = {
          name: '',
          x: Math.random() * w + (pos[0] - range[0]),
          y: Math.random() * h + (pos[1] - range[1]),
          r: Math.random() * vis.dataConfigs.inputR[1],
        }
        const passedTest = ((obj.x - pos[0]) ** 2 / range[0] ** 2) + ((obj.y - pos[1]) ** 2 / range[1] ** 2) <= 1;
        if (passedTest) {
          collection.push(obj);
        }
      }
    }

    const pos2 = [15, 75];
    const range2 = [7.5, 20];
    const rands2 = 75;
    createCluster(pos2, range2, rands2);

    const pos3 = [50, 40];
    const range3 = [15, 25];
    const rands3 = 100;
    createCluster(pos3, range3, rands3);

    const pos4 = [90, 15];
    const range4 = [5, 10];
    const rands4 = 50;
    createCluster(pos4, range4, rands4);

    const pos5 = [7.5, 25];
    const range5 = [5, 7.5];
    const rands5 = 25;
    createCluster(pos5, range5, rands5);

    const pos6 = [80, 80];
    const range6 = [7.5, 10];
    const rands6 = 38;
    createCluster(pos6, range6, rands6);

    collection.push({
      name: 'Badubada',
      x: 76,
      y: 74,
      r: 100,
    });

    return collection;
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
  manageZoom(gesture): void {

    if (gesture !== this.modes.gesture) {

      this.modes.gesture = gesture;

      if (gesture == 'zoom out' && !this.modes.zoomed) {
        this.modes.zoomed = true;
        this.zoomOut();
      } else if (gesture == 'zoom in' && this.modes.zoomed) {
        this.modes.zoomed = false;
        this.zoomIn();
      }      
    }
  }

  /**
   * onFrame
   */
  onFrame(frame: any): void {

    const vis = this;

    vis.gestures = [];

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

    // zoom
    const zoomType = vis.leapEventsService.getZoomType(frame, vis.controller, 10);
    // console.log('zoom state------>>', zoomType ) // zoom in, zoom oit, not detected

    // Trigger Zoom
    vis.manageZoom(zoomType)

  }

  /**
   * zoomIn
   */
  zoomIn(): void {

    // Check sub selections
    const invX = this.child.tools.scX.invert(this.configs.hoverX);
    const invY = this.child.tools.scY.invert(this.configs.hoverY);

    // Update scales
    this.child.tools.scX.domain([invX - 10, invX + 10]);
    this.child.tools.scY.domain([invY - 10, invY + 10]);
    this.child.tools.scR.range([0, 25]);

    this.child.wrangle();

  }

  /**
   * zoomOut
   */
  zoomOut(): void {

    // Reset scales
    this.child.tools.scX.domain(this.dataConfigs.inputX);
    this.child.tools.scY.domain(this.dataConfigs.inputY);
    this.child.tools.scR.range(this.dataConfigs.outputR);

    this.child.wrangle();

  }

}
