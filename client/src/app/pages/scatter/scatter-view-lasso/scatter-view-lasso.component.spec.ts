import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewLassoComponent } from './scatter-view-lasso.component';

describe('ScatterViewLassoComponent', () => {
  let component: ScatterViewLassoComponent;
  let fixture: ComponentFixture<ScatterViewLassoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewLassoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewLassoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
