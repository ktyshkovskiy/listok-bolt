import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { List, Item } from '../models/list.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return token 
      ? this.headers.set('Authorization', `Bearer ${token}`)
      : this.headers;
  }

  // Lists endpoints
  getLists(): Observable<List[]> {
    if (environment.useMockData) {
      return this.mockDataService.getLists();
    }
    return this.http.get<List[]>(`${this.baseUrl}/lists`, {
      headers: this.getAuthHeaders()
    });
  }

  getListById(id: string): Observable<List> {
    if (environment.useMockData) {
      return this.mockDataService.getListById(id) as Observable<List>;
    }
    return this.http.get<List>(`${this.baseUrl}/lists/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createList(list: Partial<List>): Observable<List> {
    if (environment.useMockData) {
      return this.mockDataService.createList(list);
    }
    return this.http.post<List>(`${this.baseUrl}/lists`, list, {
      headers: this.getAuthHeaders()
    });
  }

  updateList(id: string, list: Partial<List>): Observable<List> {
    if (environment.useMockData) {
      return this.mockDataService.updateList(id, list) as Observable<List>;
    }
    return this.http.put<List>(`${this.baseUrl}/lists/${id}`, list, {
      headers: this.getAuthHeaders()
    });
  }

  deleteList(id: string): Observable<any> {
    if (environment.useMockData) {
      return this.mockDataService.deleteList(id);
    }
    return this.http.delete(`${this.baseUrl}/lists/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Items endpoints
  createItem(listId: string, item: Partial<Item>): Observable<Item> {
    if (environment.useMockData) {
      return this.mockDataService.createItem(listId, item) as Observable<Item>;
    }
    return this.http.post<Item>(`${this.baseUrl}/items`, item, {
      headers: this.getAuthHeaders()
    });
  }

  getItemById(id: string): Observable<Item> {
    if (environment.useMockData) {
      return this.mockDataService.getItemById(id) as Observable<Item>;
    }
    return this.http.get<Item>(`${this.baseUrl}/items/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateItem(id: string, item: Partial<Item>): Observable<Item> {
    if (environment.useMockData) {
      return this.mockDataService.updateItem(id, item) as Observable<Item>;
    }
    return this.http.put<Item>(`${this.baseUrl}/items/${id}`, item, {
      headers: this.getAuthHeaders()
    });
  }

  deleteItem(id: string): Observable<any> {
    if (environment.useMockData) {
      return this.mockDataService.deleteItem(id);
    }
    return this.http.delete(`${this.baseUrl}/items/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}