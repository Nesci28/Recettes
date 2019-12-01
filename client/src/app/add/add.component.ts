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
import { AddImgComponent } from './add-img/add-img.component';

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
  @ViewChildren(AddImgComponent) addImgComponent: QueryList<AddImgComponent>;
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
          const { id, type } = this.route.snapshot.params;
          const meal = meals.filter(
            meal => +meal.id === +id && +meal.type === +type,
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
      this.mealService.loading$.next(true);
      this.httpService
        .addMeal(values)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          _ => {
            this.resetTheForms();
            this.mealService.loading$.next(false);
            this.alert.message = 'Recette ajoutée avec succès!';
            this.alert.type = 'success';
            setTimeout(() => {
              this.alert.type = '';
            }, 4000);
          },
          _ => {
            this.mealService.loading$.next(false);
            this.alert.message =
              'Il semble avoir un problème de connexion, réessayer plus tard!';
            this.alert.type = 'danger';
            setTimeout(() => {
              this.alert.type = '';
            }, 4000);
          },
        );
    }
  }

  makeTheObject() {
    const values: any = {};
    const header: any = this.addService.getValues([this.addHeaderComponent]);
    values.name = header.nameForm.name;
    values.description = header.nameForm.description;
    values.type = header.nameForm.type;
    values.portion = header.nameForm.portion;
    values.image = this.addImgComponent.last.croppedImg;
    values.ingredients = this.addIngredientsComponent.last.ingredientList;
    values.instructions = this.addInstructionsComponent.last.instructionList;
    values.keywords = this.addKeywordsComponent.last.keywordsList;
    values.secondLife = this.addKeywordsComponent.last.secondLifeList;
    return values;
  }

  resetTheForms(): void {
    this.addHeaderComponent.last.nameForm.reset();
    this.addHeaderComponent.last.nameRef.nativeElement.focus();
    this.addImgComponent.last.croppedImg = '';
    this.addIngredientsComponent.last.ingredientForm.reset();
    this.addIngredientsComponent.last.ingredientList = [];
    this.addInstructionsComponent.last.instructionForm.reset();
    this.addInstructionsComponent.last.instructionList = [];
    this.addKeywordsComponent.last.keywordForm.reset();
    this.addKeywordsComponent.last.keywordsList = [];
    this.addKeywordsComponent.last.secondLifeForm.reset();
    this.addKeywordsComponent.last.secondLifeList = [];
  }

  getBtnName(): string {
    return this.route.snapshot.params.id ? `Modifier` : 'Ajouter';
  }

  onModification(): boolean {
    return this.route.snapshot.params.id;
  }
}
