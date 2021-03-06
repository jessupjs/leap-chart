import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as Leap from 'leapjs';
import {LeapEventsService} from "../leap-events.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-scatter-view-select',
  templateUrl: './scatter-view-select.component.html',
  styleUrls: ['./scatter-view-select.component.scss']
})
export class ScatterViewSelectComponent implements OnInit {

  // Input, output
  @Input() components: any;

  // HTML
  @ViewChild('leap', {static: true}) leap: ElementRef;

  // Class vars (shared)
  child = null;
  controller = null;
  data = [];
  dataConfigs = {
    duration: 750,
    inputR: [0, 100],
    inputX: [0, 100],
    inputY: [0, 100],
    outputR: [0, 30],
    unitX: 'Column',
    unitY: 'Row',
    unitR: 'Evilness'
  };
  filteredSections = [];
  frame = null;
  sections = [];
  scalesetG: {};

  // Setup tasks
  scalesetCreated = false;
  focusFingersDefined = false;
  gPointersCreated = false;

  // Add class svg name specific to gesture
  className = 'select';

  // Class vars (unique)
  nameHovered = '';
  nameSelected = '';
  nameCorrect = 'Zurg';
  searchableSections = [];
  searchableNames = [];

  constructor(
    private leapEventsService: LeapEventsService
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['select'].instance = this;

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
    this.filteredSections = this.sections.filter(s => s.members.length > 0 || s.possibleMembers.length > 0);

  }

  /**
   * bubbleClick
   */
  bubbleClick() {

    // Init datum
    let datum = null

    // Update color
    d3.selectAll('.select .bubble')
      .attr('fill', d => {
        if (d.name === this.nameSelected) {
          datum = d
          return 'rgba(255, 0, 0, 1)';
        }
        return 'rgba(0, 0, 0, 1)'
      })

    // Check answer
    if (datum) {
      this.checkAnswer(datum.name);
    }
  }

  /**
   * checkAnswer
   */
  checkAnswer(name: string) {
    if (name === this.nameCorrect) {
      console.log(name, '... DING!');
    } else {
      console.log(name, '... WOMP!');
    }
  }

  /**
   * getData
   */
  getData(): any[] {
    return [
      {
        name: 'Zurg',
        x: 67,
        y: 75,
        r: 100
      },
      {
        name: 'Corty',
        x: 89,
        y: 34,
        r: 75
      },
      {
        name: 'Aligumba',
        x: 25,
        y: 82,
        r: 60
      },
      {
        name: 'Blizter',
        x: 75,
        y: 92,
        r: 25
      },
    ]
  }

  /**
   * onFrame
   */
  onFrame(frame) {

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
            if (vis.nameSelected === d.name) {
              return 'rgb(255, 0, 0)';
            }
            if (vis.searchableNames.includes(d.name)) {
              const x = d3.select(this).attr('cx');
              const y = d3.select(this).attr('cy');
              const r = d3.select(this).attr('r');
              const dist = Math.sqrt((indexFinger.x - x) ** 2 + (indexFinger.y - y) ** 2);
              if (dist <= r) {
                vis.nameHovered = d.name;
                return 'rgb(255,200,0)';
              }
            } else {
              return 'rgb(0, 0, 0)';
            }
          })
        })
    }

    // Grab status
    const handState = vis.leapEventsService.getHandStateFromHistory(frame, vis.controller, 10);
    // console.log('Grab state------>>', handState) // open, closed, opening, closing, not detected

    if (handState === 'closed') {
      // console.log('Grab---vis.nameHovered--->>', vis.nameHovered)
      vis.nameSelected = vis.nameHovered;
      vis.bubbleClick();
    }

    // Pinch type
    const pinchState = vis.leapEventsService.getPinchType(frame, vis.controller, 10, 'advanced');
    // console.log('Pinch state------>>', pinchState) // pinched, pinch opening, pinch closing, not detected

    if (pinchState === 'pinched') {

      // console.log('Pinch---vis.nameHovered--->>', vis.nameHovered);
      vis.nameSelected = vis.nameHovered;
      vis.bubbleClick();
    }

    // Gesture
    const gestureType = vis.leapEventsService.getGestureType(frame);
    // console.log('Gesture state------>>', gestureType) // swipe, keyTap, screenTap, circle, not detected

    if (gestureType == "keyTap" || gestureType == "screenTap") {
      // console.log('Gesture---vis.nameHovered--->>', vis.nameHovered)
      vis.nameSelected = vis.nameHovered;
      vis.bubbleClick();
    }

    // Touch
    const touchType = vis.leapEventsService.getTouchType(frame);
    // console.log('Touch state------>>', touchType) // hovering, touching, not detected
  }

  /**
   *
   */
  setChild(e: any): void {
    this.child = e;
  }


}
