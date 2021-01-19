import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewSwipeComponent } from './scatter-view-swipe.component';

describe('ScatterViewSwipeComponent', () => {
  let component: ScatterViewSwipeComponent;
  let fixture: ComponentFixture<ScatterViewSwipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewSwipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewSwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
