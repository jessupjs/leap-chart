import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LeapEventsService} from '../leap-events.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-view-pan-z-axis',
  templateUrl: './scatter-view-pan-z-axis.component.html',
  styleUrls: ['./scatter-view-pan-z-axis.component.scss']
})
export class ScatterViewPanZAxisComponent implements OnInit, AfterViewInit {


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
  filteredSections = [];
  frame = null;
  sections = [];
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

  // TODO: Quick solution, need cleanup
  colors = {
  	cat0: 'rgb(255, 0, 0)',
  	cat1: 'rgb(0, 153, 0)',
  	cat2: 'rgb(0, 0, 204)',
  	cat3: 'rgb(255, 153, 51)',
  	'cat0-m': 'rgb(255, 0, 0)',
  	'cat1-m': 'rgb(0, 153, 0)',
  	'cat2-m': 'rgb(0, 0, 204)',
  	'cat3-m': 'rgb(255, 153, 51)'
  }

  // Class vars (unique)
  nameHovered = '';
  nameSelected = '';
  nameCorrect = 'Zurg';
  searchableSections = [];
  searchableNames = [];

  // Add class svg name specific to gesture
  className = 'pan-z-axis';

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
    // this.colorTarget('cat0-m');
    // this.colorTarget('cat1-m');
    // this.colorTarget('cat2-m');
    // this.colorTarget('cat3-m');
  }

  /**
   * addEvents
   */
  addEvents(): void {

    // This vis
    const vis = this;

    // Break scales into sections
    const gwDomain = this.child.tools.scX.domain();
    const ghDomain = this.child.tools.scY.domain();
    const gwSpace = Math.abs(gwDomain[0]) + Math.abs(gwDomain[1]);
    const ghSpace = Math.abs(ghDomain[0]) + Math.abs(ghDomain[1]);
    const grids = 10;
    vis.sections = [];
    for (let i = 0; i < grids; i++) {
      for (let j = 0; j < grids; j++) {
        this.sections.push({
          index: i + j,
          startX: gwDomain[0] + (i * gwSpace / grids),
          startY: ghDomain[0] + (j * ghSpace / grids),
          endX: gwDomain[0] + ((i + 1) * gwSpace / grids - 1),
          endY: ghDomain[0] + ((j + 1) * ghSpace / grids - 1),
          startXRange: this.child.tools.scX(gwDomain[0] + (i * gwSpace / grids)),
          endYRange: this.child.tools.scY(ghDomain[0] + (j * ghSpace / grids)),
          endXRange: this.child.tools.scX(gwDomain[0] + ((i + 1) * gwSpace / grids - 1)),
          startYRange: this.child.tools.scY(ghDomain[0] + ((j + 1) * ghSpace / grids - 1)),
          members: [],
          neighbors: [],
          possibleMembers: [],
        });
      }
    }
    const neighbors = [
      -grids - 1, -grids, -grids + 1,
      -1, 1,
      grids - 1, grids, grids + 1
    ];
    this.child.data.forEach(d => {
      for (let i = 0; i < this.sections.length; i++) {
        const s = this.sections[i];
        if (d.x >= s.startX && d.x <= s.endX && d.y >= s.startY && d.y <= s.endY) {
          s.members.push(d.name);
          neighbors.forEach(pos => {
            if (i + pos >= 0 && i + pos <= this.sections.length - 1
              // FIXME - need to think of 1D as 2D - around the bend
            ) {
              if (!s.neighbors.includes(this.sections[i + pos].index)) {
                s.neighbors.push(this.sections[i + pos].index);
              }
              this.sections[i + pos].possibleMembers.push(d.name);
            }
          });
        }
      }
    });

    this.filteredSections = this.sections.filter(s => s.members.length > 0 || s.possibleMembers.length > 0)

  }

  /**
   * colorTarget
   */
  colorTarget(cat): void {
  	const vis = this;
    this.child.els.bubblesG.selectAll('.bubble')
      .each(function(d, i) {
        if (d.name === cat) {
          	d3.select(this)
            	.attr('fill', vis.colors[cat])
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
        name: 'cat0',
        x: Math.random() * this.dataConfigs.inputX[1],
        y: Math.random() * this.dataConfigs.inputY[1],
        r: Math.random() * this.dataConfigs.inputR[1] * 0.1,
      });
    }

    function createCluster(pos, range, rands, cat) {
      for (let i = 0; i < rands; i++) {
        const w = range[0] * 2;
        const h = range[1] * 2;
        const obj = {
          name: cat,
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

    const pos2 = [10, 75];
    const range2 = [7.5, 20];
    const rands2 = 75;
    createCluster(pos2, range2, rands2, 'cat1');

    const pos3 = [5, 40];
    const range3 = [15, 25];
    const rands3 = 100;
    createCluster(pos3, range3, rands3, 'cat2');

    const pos4 = [90, 15];
    const range4 = [5, 10];
    const rands4 = 50;
    createCluster(pos4, range4, rands4, 'cat1');

    const pos5 = [7.5, 25];
    const range5 = [5, 7.5];
    const rands5 = 25;
    createCluster(pos5, range5, rands5, 'cat1');

    const pos6 = [80, 80];
    const range6 = [7.5, 10];
    const rands6 = 38;
    createCluster(pos6, range6, rands6, 'cat3');

    // marker
    collection.push(
      {
        name: 'cat0-m',
        x: 26,
        y: 24,
        r: 20,
      },
      {
        name: 'cat1-m',
        x: 10,
        y: 84,
        r: 60,
      },
      {
        name: 'cat2-m',
        x: 6,
        y: 44,
        r: 160,
      },
      {
        name: 'cat3-m',
        x: 86,
        y: 84,
        r: 60,
      }
    );

    return collection;
  }

  /**
   *
   */
  setChild(e: any): void {
    this.child = e;
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

      // Update finger circs / pointers
      vis.leapEventsService.updateContainerPointers(fingerCoords, vis.child.els.pointersG);

      // Ck if in available section and record name of members and possible members
      vis.searchableSections = [];
      for (let i = 0; i < vis.filteredSections.length; i++) {
        const fs = vis.filteredSections[i];
        if (indexFinger['x'] >= fs.startXRange && indexFinger['x'] <= fs.endXRange
          && indexFinger['y'] >= fs.startYRange && indexFinger['y'] <= fs.endYRange
        ) {
          vis.searchableSections.push(fs);
          fs.neighbors.forEach(pos => {
            vis.searchableSections.push(vis.sections[pos]);
          });
          break;
        }
      }
      vis.searchableNames = [];
      vis.searchableSections.forEach(s => {
        vis.searchableNames = vis.searchableNames.concat(s.members).concat(s.possibleMembers);
      })
      vis.searchableNames = Array.from(new Set(vis.searchableNames));

      // Iterate bubbles
      // Fixme - need to label bubbles by grid
      vis.child.els.bubblesG.selectAll('.bubble')
        .each(function(d) {
          d3.select(this).attr('fill', d => {
            // if (vis.nameSelected === d.name) {
              // return 'rgb(255, 0, 0)';
            // }
            if (vis.searchableNames.includes(d.name)) {
              const x = d3.select(this).attr('cx');
              const y = d3.select(this).attr('cy');
              const r = d3.select(this).attr('r');
              const dist = Math.sqrt((indexFinger.x - x) ** 2 + (indexFinger.y - y) ** 2);
              if (dist <= r) {
                vis.nameHovered = d.name;
                // return 'rgb(255,200,0)';
              }
            } else {
              // return 'rgb(0, 0, 0)';
            }
          })
        })
    }

    // zoom
    const zoomType = vis.leapEventsService.getZoomType(frame, vis.controller, 10);
    console.log('2 zoom state------>>', zoomType, vis.nameHovered ) // zoom in, zoom oit, not detected

    // Trigger filter
  
    if (zoomType == 'zoom in') {
    	vis.colorTarget(vis.nameHovered)
    }

    // category color target
    this.colorTarget('cat0-m');
    this.colorTarget('cat1-m');
    this.colorTarget('cat2-m');
    this.colorTarget('cat3-m');
  }

}


