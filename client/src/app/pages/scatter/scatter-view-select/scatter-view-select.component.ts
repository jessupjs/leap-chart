import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as Leap from 'leapjs';

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

  // Class vars
  frame = null;

  // Class vars
  child = null;
  correctAnswer = 'Zurg';
  data = [
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
  ];
  dataConfigs = {
    inputR: [0, 100],
    inputX: [0, 100],
    inputY: [0, 100],
    outputR: [0, 30],
    unitX: 'Column',
    unitY: 'Row',
    unitR: 'Evilness'
  };

  constructor() {
  }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['select'].instance = this;
  }

  /**
   * addEvents
   */
  addEvents(): void {

    // Click event
    this.child.els.bubblesG.selectAll('.bubble')
      .on('click', this.bubbleClick.bind(this));

    // Gesture event
    const controller = Leap.loop({enableGestures:true}, frame => {
      console.log(frame)
      this.frame = frame;
    });
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
   *
   */
  setChild(e: any): void {
    this.child = e;
  }


}
