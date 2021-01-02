import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewZoomComponent } from './scatter-view-zoom.component';

describe('ScatterViewZoomComponent', () => {
  let component: ScatterViewZoomComponent;
  let fixture: ComponentFixture<ScatterViewZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
