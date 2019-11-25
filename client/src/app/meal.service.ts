import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { HttpCallService } from './http-call.service';
import { Meal } from './models/repas.model';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  meal: Meal;
  meals$: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);

  constructor(private httpCallService: HttpCallService) {
    this.httpCallService.getMeals().subscribe(meals => {
      console.log('meals :', meals);
      this.meals$.next(meals);
    });
  }
}
