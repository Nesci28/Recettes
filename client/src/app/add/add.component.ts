import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base/base.component';
import { HttpCallService } from '../http-call.service';
import { Meal } from '../models/repas.model';
import { AddHeaderComponent } from './add-header/add-header.component';
import { AddIngredientsComponent } from './add-ingredients/add-ingredients.component';
import { AddInstructionsComponent } from './add-instructions/add-instructions.component';
import { AddService } from './add.service';
import { MealService } from '../meal.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent extends BaseComponent implements OnInit {
  @ViewChildren(AddHeaderComponent) addHeaderComponent: QueryList<
    AddHeaderComponent
  >;
  @ViewChildren(AddIngredientsComponent) addIngredientsComponent: QueryList<
    AddIngredientsComponent
  >;
  @ViewChildren(AddInstructionsComponent) addInstructionsComponent: QueryList<
    AddInstructionsComponent
  >;

  meal: Meal;

  constructor(
    private addService: AddService,
    private route: ActivatedRoute,
    private mealService: MealService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
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
          }
        });
    }
  }

  onSubmit() {
    const errors = this.addService.checkForErrorForm(
      this.addHeaderComponent.last.nameForm,
    );
    this.addService.checkForErrorArray(
      'ingredient',
      this.addIngredientsComponent.last.ingredientList,
    );
    this.addService.checkForErrorArray(
      'instruction',
      this.addInstructionsComponent.last.instructionList,
    );
    if (
      errors === 0 &&
      this.addIngredientsComponent.last.ingredientList.length > 0
    ) {
      const values = this.addService.getValues([this.addHeaderComponent]);
      console.log('values :', values);
      console.log('sent!');
    } else {
      console.log('errors :', errors);
    }
  }
}
