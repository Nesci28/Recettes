import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mealService: MealService,
  ) {
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
    });
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
  }

  getName(name: string): string {
    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
  }

  getMeal(repas: Meal): void {
    if (!this.toBook) {
      let cont = true;
      for (const meal of this.selectedMeals) {
        if (meal.id === repas.id) {
          this.mealService.meal = meal;
          cont = false;
          break;
        }
        if (!cont) break;
      }
      if (this.route.snapshot.params.id !== 'recherche') {
        this.router.navigateByUrl(
          `/presentation/${
            this.route.snapshot.params.id
          }/${this.mealService.meal.name.replace(/ /g, '_')}`,
        );
      } else {
        console.log('repas :', repas);
        this.router.navigateByUrl(
          `/presentation/${repas.type}/${this.mealService.meal.name.replace(
            / /g,
            '_',
          )}`,
        );
      }
    } else {
      if (this.bookSelected.filter(e => e.id === repas.id).length === 0) {
        this.book.push(repas);
        this.bookSelected.push({ id: repas.id });
      } else {
        this.bookSelected = this.bookSelected.filter(e => e.id !== repas.id);
      }
    }
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

  checkIfSelected(meal: Meal): boolean {
    return this.bookSelected.filter(e => e.id === meal.id).length === 1;
  }

  getMealCategory(index: number): Meal[] {
    const searchCategory =
      index === 1 ? 'entrees' : index === 2 ? 'principal' : 'desserts';
    return this.meals.filter(meal => meal.type === searchCategory);
  }
}
