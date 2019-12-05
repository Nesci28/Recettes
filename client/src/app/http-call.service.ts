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

  getMealsByType(type: string): Observable<Meal[]> {
    return this.http.get<Meal[]>(
      `${environment.backend_url}/api/v1/find/type/${type}`,
    );
  }

  getMeal(id: string) {
    return this.http.get<Meal[]>(
      `${environment.backend_url}/api/v1/find/id/${id}`,
    );
  }

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${environment.backend_url}/api/v1/findAll`);
  }

  deleteMeal(meal: Meal): Observable<Meal> {
    return this.http.delete<Meal>(
      `${environment.backend_url}/api/v1/delete/${meal.type}/${meal.id}`,
    );
  }

  addMeal(meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${environment.backend_url}/api/v1/add`, meal);
  }

  updateMeal(meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(
      `${environment.backend_url}/api/v1/update`,
      meal,
    );
  }

  getConfirmation(password: string): Observable<string> {
    return this.http.post<string>(`${environment.backend_url}/api/v1/confirm`, {
      password,
    });
  }
}
