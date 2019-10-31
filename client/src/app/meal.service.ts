import { Injectable } from "@angular/core";
import { Meal } from "./models/repas.model";

@Injectable({
  providedIn: "root"
})
export class MealService {
  meal: Meal;

  constructor() {}
}
