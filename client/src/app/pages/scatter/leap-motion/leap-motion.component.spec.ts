import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeapMotionComponent } from './leap-motion.component';

describe('LeapMotionComponent', () => {
  let component: LeapMotionComponent;
  let fixture: ComponentFixture<LeapMotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeapMotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeapMotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
