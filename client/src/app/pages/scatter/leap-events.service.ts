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

    const splitX = frame.hasOwnProperty('interactionBox') ? frame.interactionBox.width / 2 : 256;
    const scLeapToWindowX = d3.scaleLinear()
      .domain([-splitX, splitX])
      .range([0, window.innerWidth]);
    const scLeapToWindowY = d3.scaleLinear()
      .domain([0, frame.hasOwnProperty('interactionBox') ? frame.interactionBox.height : 256])
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
      'scWindowToContainerY': scWindowToContainerY,
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

    if (frame && frame.hasOwnProperty('fingers')) {

      frame.fingers.forEach((f, i) => {

        const finger = this.fingers.find(f => f.index === i);

        if (finger) {

          const leapX = frame.fingers[i].tipPosition[0];
          const leapY = frame.fingers[i].tipPosition[1];
          const leapZ = frame.fingers[i].tipPosition[2];
          const windowX = scaleset['scLeapToWindowX'](leapX);
          const windowY = scaleset['scLeapToWindowY'](leapY);
          const containerX = scaleset['scWindowToContainerX'](windowX);
          const containerY = scaleset['scWindowToContainerY'](windowY);

          fingerCoords.push({
            name: finger.name,
            x: containerX,
            y: containerY
          });
        }
      });

    }

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

  /**
   * getGestureType
   */
  getGestureType(frame: any) {

    let gestureType = "not detected";

    if (frame && frame.data && frame.data.gestures) {

      if (frame.data.gestures.length > 0) {
        frame.data.gestures.forEach(function(gesture) {
          gestureType = gesture.type;
        })
      }
      return gestureType;
    }

  }

  /**
   * getGrabState
   * ref: https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html
   */
  getHandStateFromHistory(frame: any, controller, historySamples = 10) {

    let handState = "not detected";

    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.forEach(function(hand) {

        if (hand.grabStrength === 1) handState = "closed";
        else if (hand.grabStrength === 0) handState = "open";
        else {
          var sum = 0;
          for (var s = 0; s < historySamples; s++) {
            var oldHand = controller.frame(s).hand(hand.id)
            if (!oldHand.valid) break;
            sum += oldHand.grabStrength
          }
          var avg = sum / s;
          if (hand.grabStrength - avg < 0) handState = "opening";
          else if (hand.grabStrength > 0) handState = "closing";
        }
      })
    }
    return handState;
  }

  /**
  * getPinchType
  */
  getPinchType(frame: any, controller, historySamples = 10, option = 'basic') {

    let pinchState = "not detected";

    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.forEach(function(hand) {

        if (hand.pinchStrength === 1) pinchState = "pinched";

        if (option === 'basic') {
          if (hand.pinchStrength === 0) pinchState = "not pinched";
        }

        if (option === 'advanced') {
          var sum = 0;
          for (var s = 0; s < historySamples; s++) {
            var oldHand = controller.frame(s).hand(hand.id)
            if (!oldHand.valid) break;
            sum += oldHand.pinchStrength
          }
          var avg = sum / s;
          if (hand.pinchStrength - avg < 0) pinchState = "pinch opening";
          else if (hand.pinchStrength > 0) pinchState = "pinch closing";
        }
      })
    }

    return pinchState;
  }

  /**
  * getTouchState
  */
  getTouchType(frame: any) {

    let touchState = "not detected";
    let touchDistance = "not detected";

    if (frame && frame.pointables && frame.pointables.length > 0) {
      touchDistance = frame.pointables[1].touchDistance;
      touchState = frame.pointables[1].touchZone;
    }

    return touchState;
  }

  /**
  * getZOomType
  */
  getZoomType(frame: any, controller, historySamples = 10) {

    let zoomState = "not detected";
    let pinchState = "not detected";
    let touchState = "not detected";

    pinchState = this.getPinchType(frame, controller, 10, 'basic'); 
    touchState = this.getTouchType(frame);

    console.log('1------------', pinchState)
    console.log('2------------', touchState)

    if (pinchState === 'pinched' || touchState  === 'hovering') {
      zoomState = 'zoom out'
    } else if (pinchState === 'pinch opening' || touchState  === 'touching') { 
      zoomState = 'zoom in'
    }

    return zoomState;
  }
}
