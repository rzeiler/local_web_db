import { TestBed, inject } from '@angular/core/testing';

import { CashService } from './cash.service';

describe('CashService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashService]
    });
  });

  it('should be created', inject([CashService], (service: CashService) => {
    expect(service).toBeTruthy();
  }));
});
