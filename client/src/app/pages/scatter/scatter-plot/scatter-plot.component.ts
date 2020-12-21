import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnInit {

  // Input, output
  @Input() data: [any];
  @Input() dataConfigs: any;

  // HTML
  @ViewChild('target', {static: true}) target: ElementRef;

  // Els
  els = {
    axesG: null,
    axisX: null,
    axisY: null,
    bubblesG: null,
    g: null,
    svg: null,
  }

  // Configs
  configs = {
    axisPad: 10,
    gH: 0,
    gMargin: {top: 50, right: 100, bottom: 100, left: 50},
    gW: 0,
    svgH: 0,
    svgW: 0
  }

  // Tools
  tools = {
    axisX: d3.axisBottom(),
    axisY: d3.axisRight(),
    scColor: d3.scaleOrdinal(['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 224, 0)']),
    scR: d3.scaleSymlog(),
    scX: d3.scaleLinear(),
    scY: d3.scaleLinear(),
  }

  constructor() {
  }

  ngOnInit(): void {

    // Init
    this.init();
  }

  /**
   * init
   */
  init(): void {

    // This vis
    const vis = this;

    // Get dims
    vis.configs.svgW = vis.target.nativeElement.clientWidth;
    vis.configs.svgH = vis.target.nativeElement.clientHeight;
    vis.configs.gW = vis.configs.svgW - (vis.configs.gMargin.right + vis.configs.gMargin.left);
    vis.configs.gH = vis.configs.svgH - (vis.configs.gMargin.top + vis.configs.gMargin.bottom);

    // Build svg, g
    vis.els.svg = d3.select(vis.target.nativeElement)
      .append('svg')
      .attr('width', vis.configs.svgW)
      .attr('height', vis.configs.svgH);
    vis.els.g = vis.els.svg.append('g')
      .style('transform', `translate(${vis.configs.gMargin.right}px, ${vis.configs.gMargin.top}px)`);

    // Add major groups
    vis.els.bubblesG = vis.els.g.append('g');
    vis.els.axesG = vis.els.g.append('g');

    // Add axes
    vis.els.axisX = vis.els.axesG.append('g')
      .style('transform', `translateY(${vis.configs.gH + vis.configs.axisPad}px)`);
    vis.els.axisY = vis.els.axesG.append('g')
      .style('transform', `translateX(${vis.configs.gW + vis.configs.axisPad}px)`);

    // ..
    this.wrangle();
  }

  /**
   * wrangle
   */
  wrangle(): void {

    // This vis
    const vis = this;

    // Config scales
    this.tools.scR
      .domain(vis.dataConfigs.inputR)
      .range(vis.dataConfigs.outputR);
    this.tools.scX
      .domain(vis.dataConfigs.inputX)
      .range([0, vis.configs.gW]);
    this.tools.scY
      .domain(vis.dataConfigs.inputY)
      .range([vis.configs.gH, 0]);

    // Config axes
    this.tools.axisX.scale(this.tools.scX);
    this.tools.axisY.scale(this.tools.scY);

    // ..
    this.render();
  }

  /**
   * render
   */
  render(): void {

    // This vis
    const vis = this;

    // Build bubbles
    const bubbles = this.els.bubblesG.selectAll('.bubble')
      .data(vis.data, (d, i) => i)
      .join('circle')
      .attr('class', 'bubble')
    bubbles.transition()
      .attr('r', d => vis.tools.scR(d.r))
      .attr('cx', d => vis.tools.scX(d.x))
      .attr('cy', d => vis.tools.scY(d.y))
      .attr('opacity', 0.75);

    // Update axes
    vis.els.axisX.call(vis.tools.axisX);
    vis.els.axisY.call(vis.tools.axisY);

  }

}
