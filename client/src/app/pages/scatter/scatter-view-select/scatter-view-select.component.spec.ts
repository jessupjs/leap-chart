import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterViewSelectComponent } from './scatter-view-select.component';

describe('ScatterViewSelectComponent', () => {
  let component: ScatterViewSelectComponent;
  let fixture: ComponentFixture<ScatterViewSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterViewSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterViewSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
