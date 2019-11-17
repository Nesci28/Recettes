import { Injectable } from '@angular/core';
import { Meal } from './models/repas.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import data from '../assets/meals.json';
@Injectable({
  providedIn: 'root',
})
export class MealService {
  meal: Meal;
  meals$: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);

  constructor() {
    this.getMeals();
  }

  getMeals(): void {
    this.meals$.next(data);
  }
}
