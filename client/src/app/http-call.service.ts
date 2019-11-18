import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpCallService {
  constructor(private http: HttpClient) {}

  getMeals(): Observable<any> {
    return this.http.get('../../assets/meals.json');
  }
}
