import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterNavComponent } from './scatter-nav.component';

describe('ScatterNavComponent', () => {
  let component: ScatterNavComponent;
  let fixture: ComponentFixture<ScatterNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
