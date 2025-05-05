import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class APIBaseService {
  protected url: string = 'api';

  constructor(protected httpClient: HttpClient, controller: string) {
    this.url = `${environment.apiUrl}${controller}`;
  }

  protected get<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.url}/${endpoint}`);
  }

  protected getWithParams<T>(endpoint: string, params: any): Observable<T> {
    return this.httpClient.get<T>(`${this.url}/${endpoint}`, { params });
  }
}
