import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from 'src/animations/animations.js';

import { Meal } from './models/repas.model';
import { HttpCallService } from './http-call.service';
import { MealService } from './meal.service';
import { BaseComponent } from './base/base.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'Recettes de la Famille Harvey';
  isNavbarCollapsed = true;
  meals: Meal[] = [];

  query: string;
  loading: boolean;

  constructor(
    private router: Router,
    private httpCallService: HttpCallService,
    private mealService: MealService,
  ) {
    super();
  }

  ngOnInit() {
    this.mealService.loading$.next(true);
    this.httpCallService.getMeals().subscribe(meals => {
      console.log('meals :', meals);
      this.mealService.meals$.next(meals);
      this.mealService.loading$.next(false);
    });

    this.mealService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });
  }

  search(): void {
    const query = this.query;
    this.query = '';
    this.router.navigateByUrl(`/recherche/${query}`);
  }

  iAmAtHome(): boolean {
    return this.router.url === '/';
  }

  prepareRoute(outlet: RouterOutlet): boolean {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState']
    );
  }
}
