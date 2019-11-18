import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { BaseComponent } from '../base/base.component';
import { MealService } from '../meal.service';
import { Instruction, Meal } from '../models/repas.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss'],
})
export class MealComponent extends BaseComponent implements OnInit {
  meal: Meal;

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    if (this.mealService.meal) {
      this.meal = this.mealService.meal;
      this.prepareMeal();
    } else {
      this.mealService.meals$
        .pipe(takeUntil(this.destroy$))
        .subscribe((meals: Meal[]) => {
          const name = this.route.snapshot.params.id.replace(/_/g, ' ');
          const type = this.route.snapshot.params.type;
          const meal = meals.filter(
            meal => meal.name === name && meal.type === type,
          );
          if (meal.length > 0) {
            this.meal = meal[0];
            this.prepareMeal();
          }
        });
    }
  }

  getImage(): string {
    return `../../assets/${this.meal.name
      .toLowerCase()
      .replace(/ /g, '_')}.jpg`;
  }

  changeToModification(): void {
    this.router.navigateByUrl(
      `/modification/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}`,
    );
  }

  showOrDisableInstruction(
    instructions: Instruction[],
    step: Instruction,
  ): void {
    if (step.selected) {
      step.disabled = !step.disabled;
    } else {
      instructions.forEach(instruction => (instruction.selected = false));
      step.selected = true;
    }
  }

  prepareMeal(): void {
    this.meal.instructions.forEach((step: any) => {
      step[step.length - 1].selected = true;
    });
  }
}
