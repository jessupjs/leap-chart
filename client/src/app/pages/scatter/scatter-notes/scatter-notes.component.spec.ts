import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterNotesComponent } from './scatter-notes.component';

describe('ScatterNotesComponent', () => {
  let component: ScatterNotesComponent;
  let fixture: ComponentFixture<ScatterNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
