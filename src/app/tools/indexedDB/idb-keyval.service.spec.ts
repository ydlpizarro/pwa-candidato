import { TestBed } from '@angular/core/testing';

import { IdbKeyvalService } from './idb-keyval.service';

describe('IdbKeyvalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdbKeyvalService = TestBed.get(IdbKeyvalService);
    expect(service).toBeTruthy();
  });
});
