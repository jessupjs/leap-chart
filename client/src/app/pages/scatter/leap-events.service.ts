import {Injectable} from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class LeapEventsService {

  // Class vars
  fingers = [
    {name: 'Thumb', index: 0},
    {name: 'Index', index: 1},
    {name: 'Middle', index: 2},
    {name: 'Ring', index: 3},
    {name: 'Pinky', index: 4}
  ];
  focusFingers = [];

  constructor() {
  }

  /**
   * generateScaleset
   */
  generateScaleset(frame: any, container: Element): any {

    const splitX = frame.interactionBox.width / 2;
    const splitZ = frame.interactionBox.depth / 2;
    const scLeapToWindowX = d3.scaleLinear()
      .domain([-splitX, splitX])
      .range([0, window.innerWidth]);
    const scLeapToWindowY = d3.scaleLinear()
      .domain([0, frame.interactionBox.height])
      .range([window.innerHeight, 0]);

    const containerRect = container.getBoundingClientRect();
    const scWindowToContainerX = d3.scaleLinear()
      .domain([containerRect.left, containerRect.left + containerRect.width])
      .range([0, containerRect.width]);
    const scWindowToContainerY = d3.scaleLinear()
      .domain([containerRect.top, containerRect.top + containerRect.height])
      .range([0, containerRect.height]);

    return {
      'scLeapToWindowX': scLeapToWindowX,
      'scLeapToWindowY': scLeapToWindowY,
      'scWindowToContainerX': scWindowToContainerX,
      'scWindowToContainerY': scWindowToContainerY
    }
  }

  /**
   * generateContainerPointers
   */
  generateContainerPointers(containerG: any, r: number): void {

    containerG.selectAll('.finger')
      .data(this.fingers)
      .join('circle')
      .attr('class', 'finger')
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 0, 0, 0.5)')
      .attr('opacity', d => this.focusFingers.includes(d.name) ? 1 : 0.25)
      .style('visibility', 'visible');
  }

  /**
   * getFingersCoordsForContainer
   */
  getScaledFingersCoords(frame: any, scaleset: any): any[] {

    const fingerCoords = [];

    frame.fingers.forEach((f, i) => {

      const finger = this.fingers.find(f => f.index === i);

      const leapX = frame.fingers[i].stabilizedTipPosition[0];
      const leapY = frame.fingers[i].stabilizedTipPosition[1];
      const windowX = scaleset['scLeapToWindowX'](leapX);
      const windowY = scaleset['scLeapToWindowY'](leapY);
      const containerX = scaleset['scWindowToContainerX'](windowX);
      const containerY = scaleset['scWindowToContainerY'](windowY);

      fingerCoords.push({
        name: finger.name,
        x: containerX,
        y: containerY
      });
    });

    return fingerCoords;
  }

  /**
   * setFocusFingers
   */
  setFocusFingers(fingers: string[]): void {
    this.focusFingers = fingers;
  }

  /**
   * updateContainerPointers
   */
  updateContainerPointers(fingerCoords: any[], container: any): void {

    container.selectAll('.finger')
      .each(function(d) {

        const coords = fingerCoords.find(f => f.name === d.name);

        d3.select(this)
          .attr('cx', coords.x)
          .attr('cy', coords.y);
      });
  }


}
