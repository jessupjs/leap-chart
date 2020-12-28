import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as Leap from 'leapjs';
import {LeapEventsService} from "../leap-events.service";

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

  // Class vars
  child = null;
  controller = null;
  correctAnswer = 'Zurg';
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
  tools = {
    scLeapX: d3.scaleLinear(),
    scLeapY: d3.scaleLinear(),
    scLeapZ: d3.scaleLinear(),
    scVisgX: d3.scaleLinear(),
    scVisgY: d3.scaleLinear(),
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
    const breaks = 5;
    const sections = []
    for (let i = 0; i < breaks; i++) {
      for (let j = 0; j < breaks; j++) {
        sections.push({
          startX: gwDomain[0] + (i * gwSpace / breaks),
          startY: ghDomain[0] + (j * ghSpace / breaks),
          endX: gwDomain[0] + ((i + 1) * gwSpace / breaks - 1),
          endY: ghDomain[0] + ((j + 1) * ghSpace / breaks - 1),
          members: []
        });
      }
    }
    this.child.data.forEach(d => {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (d.x >= s.startX && d.x <= s.endX && d.y >= s.startY && d.y <= s.endY) {
          s.members.push(d.name);
          break;
        }
      }
    });
    const filteredSections = sections.filter(s => s.members.length > 0);
    console.log(filteredSections);


    // Add Controller
    this.controller = new Leap.Controller();
    this.controller.connect();

    // Gesture event
    this.controller.on('frame', onFrame);
    let scalesSet = false

    function onFrame(frame) {
      // Set scales if not set
      if (!scalesSet) {

        const splitX = frame.interactionBox.width / 2;
        vis.tools.scLeapX.domain([-splitX, splitX])
          .range([0, window.innerWidth]);
        const splitY = frame.interactionBox.height / 2;
        vis.tools.scLeapY.domain([0, frame.interactionBox.height])
          .range([window.innerHeight, 0]);

        const g = vis.child.els.g.node().getBoundingClientRect();
        vis.tools.scVisgX.domain([g.left, g.left + g.width])
          .range([0, g.width]);
        vis.tools.scVisgY.domain([g.top, g.top + g.height])
          .range([0, g.height]);

        scalesSet = true

      }

      if (frame.fingers.length > 0) {

        // Update frame
        vis.frame = frame;

        // Get coords (index finger)
        const indexLeapX = frame.fingers[1].stabilizedTipPosition[0];
        const indexLeapY = frame.fingers[1].stabilizedTipPosition[1];
        const indexWindowX = vis.tools.scLeapX(indexLeapX);
        const indexWindowY = vis.tools.scLeapY(indexLeapY);
        const indexVisgX = vis.tools.scVisgX(indexWindowX);
        const indexVisgY = vis.tools.scVisgY(indexWindowY);

        // Update visibility circ
        vis.child.els.pointerCirc
          .attr('cx', indexVisgX)
          .attr('cy', indexVisgY);

        // Check if in available section
        filteredSections.forEach(fs => {

        });

      }
    }


  }

  /**
   * bubbleClick
   */
  bubbleClick(e: any, d: any) {

    // Update color
    d3.selectAll('.bubble')
      .attr('fill', 'black');
    d3.select(e.target)
      .attr('fill', 'red');

    // Check answer
    this.checkAnswer(d.name)
  }

  /**
   * checkAnswer
   */
  checkAnswer(name: string) {
    if (name === this.correctAnswer) {
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
