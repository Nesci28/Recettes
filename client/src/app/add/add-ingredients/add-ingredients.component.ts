import { Component, OnInit, QueryList } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IngredientList } from 'src/app/models/add.model';
import { AddService } from '../add.service';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/meal.service';
import { BaseComponent } from 'src/app/base/base.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-add-ingredients',
  templateUrl: './add-ingredients.component.html',
  styleUrls: ['./add-ingredients.component.scss'],
})
export class AddIngredientsComponent extends BaseComponent implements OnInit {
  errors: { name: string; validators: string[]; show: boolean }[];
  typeArr: string[] = [
    'Produit laitier',
    'Légume',
    'Viande',
    'Poisson',
    'Fruit',
    'Autre',
  ];
  unitArr: string[] = [
    'c. à thé',
    'c. à soupe',
    'ml',
    'l',
    'oz',
    'tasse',
    'g',
    'kg',
    'lb',
  ];

  // Forms
  ingredientForm = new FormGroup({
    ingredient: new FormControl('', Validators.required),
    ingType: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    unit: new FormControl('', Validators.required),
  });

  ingredientList: IngredientList[] = [];

  constructor(
    private addService: AddService,
    private router: ActivatedRoute,
    private mealService: MealService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.router.snapshot.url[0].path === 'modification') {
      this.ingredientList = this.mealService.meal.ingredients;
    }
    this.addService.formErrors$
      .pipe(takeUntil(this.destroy$))
      .subscribe(errors => {
        this.errors = errors;
        console.log(this.errors);
      });
  }

  get ingredient() {
    return this.ingredientForm.get('ingredient');
  }
  get ingType() {
    return this.ingredientForm.get('ingType');
  }
  get quantity() {
    return this.ingredientForm.get('quantity');
  }
  get unit() {
    return this.ingredientForm.get('unit');
  }

  submitIngredient(): void {
    if (this.ingredientForm.valid) {
      this.setShowToFalse('ingredient');
      this.addIngredient();
    } else {
      this.addService.checkForErrorForm(this.ingredientForm);
    }
  }

  addIngredient(): void {
    this.ingredientList.push({
      ingredient: this.ingredient.value,
      ingType: this.typeArr[this.ingType.value - 1].toLowerCase(),
      quantity: this.quantity.value,
      unit: this.unitArr[this.unit.value - 1].toLowerCase(),
    });
    this.ingredientForm.reset();
  }

  removeIngredient(ingredient: IngredientList): void {
    this.ingredientList = this.ingredientList.filter(
      e => e.ingredient !== ingredient.ingredient,
    );
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }

  getFilteredList(): any {
    const result = this.ingredientList.reduce(function(r, a) {
      r[a.ingType] = r[a.ingType] || [];
      r[a.ingType].push(a);
      return r;
    }, Object.create(null));
    console.log(Object.values(result));
    return Object.values(result);
  }
}
