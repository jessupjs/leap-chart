import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LeapEventsService} from "../leap-events.service";

@Component({
  selector: 'app-scatter-view-zoom',
  templateUrl: './scatter-view-zoom.component.html',
  styleUrls: ['./scatter-view-zoom.component.scss']
})
export class ScatterViewZoomComponent implements OnInit {

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
    outputR: [0, 5],
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
    this.components.views['zoom'].instance = this;

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
      x: 50,
      y: 50,
      r: 100,
    })


    return collection;
  }

  /**
   *
   */
  setChild(e: any): void {
    this.child = e;
  }

}
