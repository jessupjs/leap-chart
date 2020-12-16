import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.scss']
})
export class BubblesComponent implements OnInit {

  // HTML
  @ViewChild('vis', {static: true}) visTarget: ElementRef;
  @ViewChild('zSlider', {static: true}) zSlider: ElementRef;

  // Data
  // https://oasishub.co/dataset/usa-tornado-historical-tracks-noaa/resource/b2a11100-eac5-4d10-869a-87ba064ede2d?inner_span=True
  data = {
    display: [],
    nest: new Map(),
    orig: [],
    path: '/assets/data/1950-2018_all_tornadoes.csv',
    timezones: [],
  }

  // Els
  els = {
    bubblesG: null,
    g: null,
    svg: null,
  }

  // Configs
  configs = {
    gH: 0,
    gMargin: {top: 100, right: 250, bottom: 100, left: 250},
    gW: 0,
    svgH: 0,
    svgW: 0
  }

  // Sels
  sels = {
    color: 'st',
    x: 'len',
    y: 'wid',
    r: 'mag',
    z: 2018
  }

  // Tools
  tools = {
    scColor: d3.scaleOrdinal(['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 224, 0)']),
    scR: d3.scaleSymlog(),
    scX: d3.scaleLinear(),
    scY: d3.scaleLinear(),
  }

  constructor() { }

  ngOnInit(): void {
    d3.csv(this.data.path, d => {

      // Parse
      // https://www.spc.noaa.gov/wcm/data/SPC_severe_database_description.pdf
      d.closs = +d.closs; // Estimated crop loss ($mil) - started 2007
      d.date = new Date(d.date); // Date
      d.dy = +d.dy; // Day
      // d.elat = d.elat; // Ending lat
      // d.elon = d.elon; // Ending long
      // d.f1 = d.f1; // 1st county FIPS code
      // d.f2 = d.f2; // 2nd county FIPS code
      // d.f3= d.f3; // 3rd county FIPS code
      // d.f4 = d.f4; // 4th county FIPS code
      d.fat = +d.fat; // Fatalities
      d.fc = +d.fc; // Unaltered (E)F-scale rating
      d.inj = +d.inj; // Injuries
      d.len = +d.len; // Length (mi)
      d.loss = +d.loss; // Est property loss info - pre1996, cat cod; 1996+, amt in $mil
      d.mag = +d.mag; // F-scale
      d.mo = +d.mo; // Month
      d.ns = +d.ns; // Number of states effected by tornado
      d.om = +d.om; // Tornado number
      d.sg = +d.sg // Tornado segment number - diff values prior 2007
      d.slat = +d.slat // Starting lat
      d.slon = +d.slon // Starting long
      d.sn = +d.sn // State Number
      // d.st = d.st // State
      d.stf = d.sty // State FIPS number
      // d.stn = d.stn // State number
      // d.time = d.time // Time
      // d.tz = d.tz // Time zone
      d.wid = +d.wid // Width (yards)
      d.yr = +d.yr // Year

      return d;
    }).then(d => {

      // Define data
      this.data.orig = d;

      // Nest by year
      this.data.nest = d3.group(this.data.orig, d => d.yr);

      // Get timezone info for scale coloring
      this.data.timezones = Array.from( new Set(this.data.orig.map(d => d[this.sels.color])));
      this.data.timezones.sort();
      this.tools.scColor.domain(this.data.timezones);
      console.log(this.data.timezones)

      // Init
      this.init();

    }).catch(err => console.log(err));
  }

  /** 1.
   * init
   */
  init(): void {
    // This vis
    const vis = this;

    // Get dims
    this.configs.svgW = this.visTarget.nativeElement.clientWidth;
    this.configs.svgH = this.visTarget.nativeElement.clientHeight;
    this.configs.gW = this.configs.svgW - (this.configs.gMargin.right + this.configs.gMargin.left);
    this.configs.gH = this.configs.svgH - (this.configs.gMargin.top + this.configs.gMargin.bottom);

    // Build svg, g
    this.els.svg = d3.select(this.visTarget.nativeElement)
      .append('svg')
      .attr('width', this.configs.svgW)
      .attr('height', this.configs.svgH);
    this.els.g = this.els.svg.append('g')
      .style('transform', `translate(${vis.configs.gMargin.right}px, ${vis.configs.gMargin.top}px)`);

    // Add major groups
    this.els.bubblesG = this.els.g.append('g');

    // Wrangle
    this.wrangle();

  }

  /** 2.
   * wrangle
   */
  wrangle(): void {
    // This vis
    const vis = this;

    // Get display data
    vis.data.display = vis.data.nest.get(vis.sels.z);
    vis.data.display = vis.data.display.filter(d => {
      if (d[vis.sels.r] >= 0) {
        return d;
      }
    });
    const timezones = Array.from( new Set(this.data.orig.map(d => d[this.sels.color])));
    console.log(timezones)

    // Config scales
    this.tools.scR
      .domain(d3.extent(vis.data.display, d => d[vis.sels.r]))
      .range([1, 15]);
    this.tools.scX
      .domain(d3.extent(vis.data.display, d => d[vis.sels.x]))
      .range([0, vis.configs.gW]);
    this.tools.scY
      .domain(d3.extent(vis.data.display, d => d[vis.sels.y]))
      .range([vis.configs.gH, 0]);

    // Render
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
      .data(vis.data.display, (d, i) => i)
      .join('circle')
      .attr('class', 'bubble')
    bubbles.transition(1500)
      .attr('r', d => vis.tools.scR(d[vis.sels.r]))
      .attr('cx', d => vis.tools.scX(d[vis.sels.x]))
      .attr('cy', d => vis.tools.scY(d[vis.sels.y]))
      .attr('fill', d => vis.tools.scColor(d[vis.sels.color]))
      .attr('opacity', 0.75);
  }

  updateZ(): void {
    this.sels.z = +this.zSlider.nativeElement.value;
    this.wrangle();
  }

}
