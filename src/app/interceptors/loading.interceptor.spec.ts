import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
    ]);
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        LoadingInterceptor,
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });

    interceptor = TestBed.inject(LoadingInterceptor);
    loadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    mockHandler = handlerSpy;
  });

  it('should call show() and hide() on LoadingService', () => {
    const mockRequest = {} as HttpRequest<any>;
    const mockEvent = {} as HttpEvent<any>;

    mockHandler.handle.and.returnValue(of(mockEvent));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });
});
