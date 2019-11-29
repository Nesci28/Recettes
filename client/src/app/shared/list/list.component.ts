import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import data from '../../../assets/meals.json';
import { BaseComponent } from '../../base/base.component';
import { MealService } from '../../meal.service';
import { Meal } from '../../models/repas.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent extends BaseComponent implements OnInit {
  id: string;
  meals: Meal[] = data;
  selectedMeals: Meal[] = [];
  meal: Meal;
  image: string;
  book: Meal[] = [];
  bookSelected: { id: number }[] = [];
  toBook: boolean;

  query: string;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(private route: ActivatedRoute, private mealService: MealService) {
    super();
    this.modelChanged
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(model => {
        this.query = model;
        this.resetFilter();
        this.selectedMeals.forEach(x => {
          x.filtered = model
            ? !x.name.toLowerCase().includes(model.toLowerCase())
            : false;
        });
        this.filteredMeals();
      });
  }

  ngOnInit() {
    this.mealService.meals$.pipe(takeUntil(this.destroy$)).subscribe(meals => {
      this.meals = meals;
      this.toBook = this.route.snapshot.routeConfig.path === 'livre';
      if (!this.toBook) {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe(x => {
          if (this.route.snapshot.params.id === 'recherche') {
            this.selectedMeals = this.meals.filter(
              meal =>
                meal.name
                  .toLowerCase()
                  .includes(this.route.snapshot.params.query.toLowerCase()) ||
                meal.keywords
                  .join('')
                  .toLowerCase()
                  .includes(this.route.snapshot.params.query.toLowerCase()),
            );
            console.log('this.selectedMeals :', this.selectedMeals);
          } else {
            this.image = null;
            this.meal = null;
            this.selectedMeals = [];

            this.id = this.route.snapshot.params.id;
            this.resetFilter();
          }
        });
      } else {
        this.selectedMeals = this.meals;
        this.id = 'all';
      }
    });
  }

  changed(text: string): void {
    this.modelChanged.next(text);
  }

  filteredMeals(): void {
    const mealsArr = [];
    this.selectedMeals.forEach(meal => {
      if (!meal.filtered) {
        mealsArr.push(meal);
      }
    });
    this.createArrayOfMeals(mealsArr);
  }

  // Helpers
  resetFilter(): void {
    if (this.id !== 'all') {
      const selectedMealsBCK = this.meals.filter(meal => meal.type === this.id);
      this.createArrayOfMeals(selectedMealsBCK);
    } else {
      this.createArrayOfMeals(this.meals);
    }
  }

  createArrayOfMeals(meals): void {
    this.selectedMeals = meals;
  }
}
