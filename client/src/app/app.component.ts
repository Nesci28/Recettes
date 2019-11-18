import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from 'src/animations/animations.js';

import { Meal } from './models/repas.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
})
export class AppComponent implements OnInit {
  title = 'Recettes de la Famille Harvey';
  isNavbarCollapsed = true;
  meals: Meal[] = [];

  query: string;

  constructor(private router: Router) {}

  ngOnInit() {}

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
