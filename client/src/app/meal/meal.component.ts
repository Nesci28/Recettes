import { Component, OnInit } from '@angular/core';
import { MealService } from '../meal.service';
import { Meal } from '../models/repas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCallService } from '../http-call.service';
import { isArray } from 'util';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss'],
})
export class MealComponent implements OnInit {
  meal: Meal;

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
    private router: Router,
    private httpCallservice: HttpCallService,
  ) {}

  ngOnInit() {
    this.meal = this.mealService.meal;
    if (!this.meal) {
      this.httpCallservice.getMeal().subscribe(meals => {
        this.meal = meals.filter(
          meal =>
            meal.type === this.route.snapshot.params.type &&
            meal.name.replace(/ /g, '_') === this.route.snapshot.params.id,
        )[0];
        this.mealService.meal = this.meal;
      });
    }
  }

  getImage(): string {
    return `../../assets/${this.mealService.meal.name
      .toLowerCase()
      .replace(/ /g, '_')}.jpg`;
  }

  changeToModification(): void {
    this.router.navigateByUrl(
      `/modification/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}`,
    );
  }

  checkTypeOfInstruction(instruction): boolean {
    return isArray(instruction);
  }
}
