import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewFilterComponent } from './scatter-view-filter.component';

describe('ScatterViewFilterComponent', () => {
  let component: ScatterViewFilterComponent;
  let fixture: ComponentFixture<ScatterViewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
