import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewRotateComponent } from './scatter-view-rotate.component';

describe('ScatterViewRotateComponent', () => {
  let component: ScatterViewRotateComponent;
  let fixture: ComponentFixture<ScatterViewRotateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewRotateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewRotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
