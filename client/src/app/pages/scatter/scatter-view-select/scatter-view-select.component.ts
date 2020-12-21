import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-scatter-view-select',
  templateUrl: './scatter-view-select.component.html',
  styleUrls: ['./scatter-view-select.component.scss']
})
export class ScatterViewSelectComponent implements OnInit {

  // Input, output
  @Input() components: any;

  // Class vars
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

  constructor() { }

  ngOnInit(): void {

    // Set board in thread
    this.components.views['select'].instance = this;
  }



}
