import { TestBed, inject } from '@angular/core/testing';

import { AdmindbService } from './admindb.service';

describe('AdmindbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdmindbService]
    });
  });

  it('should be created', inject([AdmindbService], (service: AdmindbService) => {
    expect(service).toBeTruthy();
  }));
});
