import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent implements OnInit, AfterViewInit {

  components = {
    'board': {
      instance: null
    },
    'main': {
      instance: null
    },
    'nav': {
      instance: null,
    },
    'notes': {
      instance: null,
    },
    'views': {
      'select': {
        copy: 'Lil Space Cowboy X\'s concert has attracted some of the galaxy\'s most sinister super-evil supreme ' +
          'leaders. We\'ve located the most dangerous, but need you to select the worst of the worst to follow into ' +
          'the far reaches of the unknown universe.',
        title: 'Part 1. The lineup (select)',
        instance: null,
        selected: false
      },
      'zoom': {
        copy: 'Need more story ...',
        title: 'Part 2. (zoom)',
        instance: null,
        selected: false
      },
      'pan': {
        copy: 'Need more story ...',
        title: 'Part 3. (pan)',
        instance: null,
        selected: false
      },
    }
  };
  selectedView = '';

  constructor() {
  }

  ngOnInit(): void {

    // Set main in map
    this.components['main'].instance = this;
  }

  ngAfterViewInit() {

    // Set start view
    this.setSelectedView('select');
  }

  /**
   * setSelectedView
   */
  setSelectedView(ref: string): void {
    this.selectedView = ref;
    this.components.views[ref].selected = true;
    for (let [k, v] of Object.entries(this.components.views)) {
      v.selected = k === ref;
    }

    // Broadcast changes
    this.components['nav'].instance.wrangle();
    this.components['notes'].instance.wrangle();
    this.components['board'].instance.wrangle();
  }

  /**
   * updateNotes
   */
  updateNotes(): void {
    this.components['notes'].instance.wrangle();
  }

}
