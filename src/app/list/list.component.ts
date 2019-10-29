import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";

import { BaseComponent } from "../base/base.component";
import { Meal } from "../models/repas.model";
import data from "./meals.json";
import { MealService } from "../meal.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent extends BaseComponent implements OnInit {
  id: string;
  meals: Meal[] = data;
  selectedMeals: Meal[][] = [];
  meal: Meal;
  image: string;

  query: string;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mealService: MealService
  ) {
    super();
    this.modelChanged
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(model => {
        this.query = model;
        this.resetFilter();
        this.selectedMeals.forEach(x => {
          x.forEach(e => {
            if (model) {
              e.filtered = !e.name.toLowerCase().includes(model.toLowerCase());
            } else {
              console.log("empty");
              e.filtered = false;
            }
          });
        });
        this.filteredMeals();
      });
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.image = null;
      this.meal = null;
      this.selectedMeals = [];

      this.id = this.route.snapshot.params.id;
      this.resetFilter();
    });
  }

  getName(name): string {
    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
  }

  getMeal(repas): void {
    let cont = true;
    for (const meals of this.selectedMeals) {
      for (const meal of meals) {
        if (meal.id === repas.id) {
          this.mealService.meal = meal;
          cont = false;
          break;
        }
      }
      if (!cont) break;
    }
    this.router.navigateByUrl(
      `/presentation/${
        this.route.snapshot.params.id
      }/${this.mealService.meal.name.replace(/ /g, "_")}`
    );
  }

  changed(text: string): void {
    this.modelChanged.next(text);
  }

  filteredMeals(): void {
    const mealsArr = [];
    this.selectedMeals.forEach(meals => {
      meals.forEach(meal => {
        if (!meal.filtered) {
          mealsArr.push(meal);
        }
      });
    });
    this.createArrayOfMeals(mealsArr);
  }

  // Helpers
  resetFilter(): void {
    const selectedMealsBCK = this.meals.filter(meal => meal.type === this.id);
    this.createArrayOfMeals(selectedMealsBCK);
  }

  createArrayOfMeals(meals): void {
    this.selectedMeals = [];
    while (meals.length > 0) {
      this.selectedMeals.push(meals.splice(0, 4));
    }
  }
}
