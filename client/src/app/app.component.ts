import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Meal } from './models/repas.model';
import { MealService } from './meal.service.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Recettes de la Famille Harvey';
  isNavbarCollapsed = true;
  meals: Meal[] = [];

  query: string;

  constructor(private router: Router, private mealService: MealService) {}

  ngOnInit() {}

  search(): void {
    const query = this.query;
    this.query = '';
    this.router.navigateByUrl(`/recherche/${query}`);
  }
}
