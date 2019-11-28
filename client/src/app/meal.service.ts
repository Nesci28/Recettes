import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { HttpCallService } from './http-call.service';
import { Meal } from './models/repas.model';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  meal: Meal;

  // Observables
  meals$: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}
}
