import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meal } from './models/repas.model';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpCallService {
  constructor(private http: HttpClient) {}

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>('../../assets/meals.json');
  }

  addMeal(meal: Meal): any {
    return this.http.post<any>(`${environment.backend_url}/api/v1/add`, meal);
  }
}
