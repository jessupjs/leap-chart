import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as Leap from 'leapjs';
import {LeapEventsService} from "../leap-events.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-scatter-view-select',
  templateUrl: './scatter-view-select.component.html',
  styleUrls: ['./scatter-view-select.component.scss']
})
export class ScatterViewSelectComponent implements OnInit, AfterViewInit {

  // Input, output
  @Input() components: any;

  // HTML
  @ViewChild('leap', {static: true}) leap: ElementRef;

  // Class vars
  frame = null;
  searchableSections = [];
  searchableNames = [];

  // Class vars
  child = null;
  controller = null;
  nameHovered = '';
  nameSelected = '';
  nameCorrect = 'Zurg';
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
  scalesetG: {};
  tools = {
    scLeapToWindowX: d3.scaleLinear(),
    scLeapToWindowY: d3.scaleLinear(),
    scWindowToContainerX: d3.scaleLinear(),
    scWindowToContainerY: d3.scaleLinear(),
  }

  ngAfterViewInit() {
  }

  constructor(
    private leapEventsService: LeapEventsService
  ) {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['select'].instance = this;

    // Get data
    this.data = this.getData();
  }

  /**
   * addEvents
   */
  addEvents(): void {

    // This vis
    const vis = this;

    // Click event
    this.child.els.bubblesG.selectAll('.bubble')
      .on('click', this.bubbleClick.bind(this));

    // Break scales into sections
    const gwDomain = this.child.tools.scX.domain();
    const ghDomain = this.child.tools.scY.domain();
    const gwSpace = Math.abs(gwDomain[0]) + Math.abs(gwDomain[1]);
    const ghSpace = Math.abs(ghDomain[0]) + Math.abs(ghDomain[1]);
    const grids = 10;
    const sections = []
    for (let i = 0; i < grids; i++) {
      for (let j = 0; j < grids; j++) {
        sections.push({
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
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (d.x >= s.startX && d.x <= s.endX && d.y >= s.startY && d.y <= s.endY) {
          s.members.push(d.name);
          neighbors.forEach(pos => {
            if (i + pos >= 0 && i + pos <= sections.length - 1
              // FIXME - need to think of 1D as 2D - around the bend
            ) {
              if (!s.neighbors.includes(sections[i + pos].index)) {
                s.neighbors.push(sections[i + pos].index);
              }
              sections[i + pos].possibleMembers.push(d.name);
            }
          });
        }
      }
    });
    const filteredSections = sections.filter(s => s.members.length > 0 || s.possibleMembers.length > 0);


    // Add Controller
    this.controller = Leap.loop({enableGestures: true}, frame => onFrame(frame));

    // Setup tasks
    let scalesetCreated = false;
    let focusFingersDefined = false;
    let gPointersCreated = false;

    function onFrame(frame) {

      // Set scales if not set
      if (!scalesetCreated) {
        vis.scalesetG = vis.leapEventsService.generateScaleset(frame, vis.child.els.g.node())
        scalesetCreated = true;
      }

      if (!focusFingersDefined) {
        vis.leapEventsService.setFocusFingers(['Index']);
        let focusFingersDefined = true;
      }

      if (!gPointersCreated) {
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
        for (let i = 0; i < filteredSections.length; i++) {
          const fs = filteredSections[i];
          if (indexFinger['x'] >= fs.startXRange && indexFinger['x'] <= fs.endXRange
            && indexFinger['y'] >= fs.startYRange && indexFinger['y'] <= fs.endYRange
          ) {
            vis.searchableSections.push(fs);
            fs.neighbors.forEach(pos => {
              vis.searchableSections.push(sections[pos]);
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
      console.log('Grab state------>>', handState) // open, closed, opening, closing, not detected

      // Pinch status
      const pinchState = vis.leapEventsService.getPinchState(frame);
      console.log('Pinch state------>>', pinchState) // pinched, not pinched, not detected

      // Gesture
      const gestureType = vis.leapEventsService.getGestureType(frame);
      console.log('Gesture state------>>', gestureType) // swipe, keyTap, screenTap, circle, not detected

      // Touch
      const touchType = vis.leapEventsService.getTouchType(frame);
      console.log('Touch state------>>', touchType) // hovering, touching, not detected
    }
  }

  /**
   * bubbleClick
   */
  bubbleClick() {

    // Update color
    d3.selectAll('.bubble')
      .attr('fill', d => {
        if (d.name === this.nameSelected) {
          return 'rgba(255, 0, 0, 1)';
        }
        return 'rgba(0, 0, 0, 1)'
      })

    // Check answer
    // this.checkAnswer(d.name)
  }

  /**
   * checkAnswer
   */
  checkAnswer(name: string) {
    if (name === this.nameCorrect) {
      console.log('DING!');
    } else {
      console.log('WOMP!');
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
   *
   */
  setChild(e: any): void {
    this.child = e;
  }


}
