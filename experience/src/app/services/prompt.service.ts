import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  constructor(private http: HttpClient) {}

  getMyPrompts(appId?: string, appName?: string): Observable<any[]> {
    let params: any = {};
    if (appId) params.appId = appId;
    if (appName) params.appName = appName;
    return this.http.get<any[]>(`${API_URL}/prompts`, { params });
  }

  getPublicPrompts(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/prompts/public`);
  }

  getPrompt(promptId: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/prompts/${promptId}`);
  }

  createPrompt(data: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/prompts`, data);
  }

  updatePrompt(promptId: string, data: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/prompts/${promptId}`, data);
  }

  deletePrompt(promptId: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/prompts/${promptId}`);
  }

  testPrompt(promptId: string, context: string, testData: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/prompts/${promptId}/test`, { context, testData });
  }
}
