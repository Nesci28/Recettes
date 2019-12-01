import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import data from '../../../assets/meals.json';
import { BaseComponent } from '../../base/base.component';
import { MealService } from '../../meal.service';
import { Meal } from '../../models/repas.model';
import { HttpCallService } from 'src/app/http-call.service.js';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent extends BaseComponent implements OnInit {
  currentId: string;
  id: string;
  meals: Meal[] = data;
  selectedMeals: Meal[] = [];
  searchedMeals: Meal[] = [];
  meal: Meal;
  image: string;
  book: Meal[] = [];
  bookSelected: { id: number }[] = [];
  toBook: boolean;

  query: string;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private httpCallService: HttpCallService,
  ) {
    super();
    this.modelChanged
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(model => {
        this.query = model;
        if (this.route.snapshot.params.id !== 'recherche' || model === '') {
          this.resetFilter();
        }
        this.selectedMeals.forEach(x => {
          x.filtered = model
            ? !x.name.toLowerCase().includes(model.toLowerCase())
            : false;
        });
        this.filteredMeals();
      });
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params.id;
    if (this.currentId) {
      this.getMealsByType();
      this.route.params.subscribe(routeParams => {
        if (routeParams.id !== this.currentId) {
          this.currentId = routeParams.id;
          this.getMeals();
        }
      });
    } else {
      this.getMeals();
    }
  }

  getMeals(): void {
    this.mealService.loading$.next(true);
    this.httpCallService
      .getMeals()
      .pipe(takeUntil(this.destroy$))
      .subscribe(meals => {
        this.mainLogic();
        this.mealService.meals$.next(meals);
        this.mealService.loading$.next(false);
      });
  }

  getMealsByType(): void {
    this.mealService.loading$.next(true);
    this.httpCallService
      .getMealsByType(this.route.snapshot.params.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(meals => {
        this.mainLogic();
        this.mealService.meals$.next(meals);
        this.mealService.loading$.next(false);
      });
  }

  mainLogic(): void {
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
            if (this.searchedMeals.length === 0) {
              this.searchedMeals = this.selectedMeals;
            }
            this.id = 'recherche';
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
    if (this.id !== 'all' && this.id !== 'recherche') {
      const selectedMealsBCK = this.meals.filter(meal => meal.type === this.id);
      this.createArrayOfMeals(selectedMealsBCK);
    } else if (this.id === 'recherche') {
      this.createArrayOfMeals(this.searchedMeals);
    } else {
      this.createArrayOfMeals(this.meals);
    }
  }

  createArrayOfMeals(meals): void {
    this.selectedMeals = meals;
  }
}
