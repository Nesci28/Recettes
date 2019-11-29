import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { Meal } from './models/repas.model';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  meal: Meal;
  book: Meal[] = [];

  // Observables
  meals$: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  portion$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {}
}
