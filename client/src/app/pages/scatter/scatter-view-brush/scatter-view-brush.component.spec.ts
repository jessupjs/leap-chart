import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewBrushComponent } from './scatter-view-brush.component';

describe('ScatterViewBrushComponent', () => {
  let component: ScatterViewBrushComponent;
  let fixture: ComponentFixture<ScatterViewBrushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewBrushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
