import { TestBed } from '@angular/core/testing';

import { CurrentuserService } from './currentuser.service';

describe('CurrentuserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentuserService = TestBed.get(CurrentuserService);
    expect(service).toBeTruthy();
  });
});
