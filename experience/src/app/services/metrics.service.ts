// src/app/services/metrics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private API_URL = 'http://localhost:3000/api/metrics';

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }
}