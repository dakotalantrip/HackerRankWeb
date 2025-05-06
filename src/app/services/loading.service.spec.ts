import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit "true" when show() is called', (done) => {
    service.loading$.subscribe((isLoading: boolean) => {
      if (isLoading) {
        expect(isLoading).toBeTrue();
        done();
      }
    });

    service.show();
  });

  it('should emit true, then false, when show() and hide() are called toggled', (done) => {
    const emittedValues: boolean[] = [];

    service.loading$.subscribe((isLoading) => {
      emittedValues.push(isLoading);

      if (emittedValues.length === 2) {
        expect(emittedValues).toEqual([false, true]);
        done();
      }
    });

    service.show();
    service.hide();
  });
});
