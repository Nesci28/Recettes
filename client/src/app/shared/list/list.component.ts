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
  searchedMeals: Meal[] = [];
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
        if (this.route.snapshot.params.id !== 'recherche' || model === '') {
          this.resetFilter();
        }
        console.log('this.selectedMeals start:', this.selectedMeals);
        this.selectedMeals.forEach(x => {
          x.filtered = model
            ? !x.name.toLowerCase().includes(model.toLowerCase())
            : false;
        });
        console.log('this.selectedMeals filtered:', this.selectedMeals);
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
    console.log('this.id :', this.id);
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
