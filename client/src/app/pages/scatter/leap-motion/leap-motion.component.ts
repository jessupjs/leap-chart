import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-leap-motion',
  templateUrl: './leap-motion.component.html',
  styleUrls: ['./leap-motion.component.scss']
})
export class LeapMotionComponent implements OnInit {

  // Inputs
  @Input() frame: any;

  // Class vars

  constructor() { }

  ngOnInit(): void {

  }

}
