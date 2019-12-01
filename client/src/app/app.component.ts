import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { routeTransitionAnimations } from 'src/animations/animations.js';

import { BaseComponent } from './base/base.component';
import { MealService } from './meal.service';
import { Meal } from './models/repas.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
})
export class AppComponent extends BaseComponent implements AfterViewChecked {
  title = 'Recettes de la Famille Harvey';
  isNavbarCollapsed = true;
  meals: Meal[] = [];

  query: string;
  loading: boolean;

  constructor(
    private router: Router,
    private mealService: MealService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngAfterViewChecked() {
    this.mealService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
        this.cdRef.detectChanges();
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
