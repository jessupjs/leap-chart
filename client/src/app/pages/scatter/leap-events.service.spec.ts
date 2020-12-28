import { TestBed } from '@angular/core/testing';

import { LeapEventsService } from './leap-events.service';

describe('LeapEventsService', () => {
  let service: LeapEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeapEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
