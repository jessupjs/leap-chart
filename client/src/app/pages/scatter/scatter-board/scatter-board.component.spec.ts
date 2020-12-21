import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterBoardComponent } from './scatter-board.component';

describe('ScatterBoardComponent', () => {
  let component: ScatterBoardComponent;
  let fixture: ComponentFixture<ScatterBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
