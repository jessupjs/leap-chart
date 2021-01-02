import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewPanComponent } from './scatter-view-pan.component';

describe('ScatterViewPanComponent', () => {
  let component: ScatterViewPanComponent;
  let fixture: ComponentFixture<ScatterViewPanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewPanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewPanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
