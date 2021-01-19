import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewPanZAxisComponent } from './scatter-view-pan-z-axis.component';

describe('ScatterViewPanZAxisComponent', () => {
  let component: ScatterViewPanZAxisComponent;
  let fixture: ComponentFixture<ScatterViewPanZAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewPanZAxisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewPanZAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
