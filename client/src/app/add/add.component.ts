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
import { AddKeywordsComponent } from './add-keywords/add-keywords.component';

interface Alert {
  type: string;
  message: string;
}

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
  @ViewChildren(AddKeywordsComponent) addKeywordsComponent: QueryList<
    AddKeywordsComponent
  >;
  alert: Alert = {} as Alert;
  meal: Meal;

  constructor(
    private addService: AddService,
    private route: ActivatedRoute,
    private mealService: MealService,
    private httpService: HttpCallService,
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
      const values = this.makeTheObject();
      console.log('values :', values);
      this.httpService
        .addMeal(values)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          _ => {
            this.alert.message = 'Recette ajoutée avec succès!';
            this.alert.type = 'success';
          },
          _ => {
            this.alert.message =
              'Il semble avoir un problème de connexion, réessayer plus tard!';
            this.alert.type = 'danger';
          },
        );
    } else {
      console.log('errors :', errors);
    }
  }

  makeTheObject() {
    const values: any = {};
    const header: any = this.addService.getValues([this.addHeaderComponent]);
    values.name = header.nameForm.name;
    values.description = header.nameForm.description;
    values.type = header.nameForm.type;
    values.ingredients = this.addIngredientsComponent.last.ingredientList;
    values.instructions = [this.addInstructionsComponent.last.instructionList];
    values.keywords = this.addKeywordsComponent.last.keywordsList;
    return values;
  }
}
