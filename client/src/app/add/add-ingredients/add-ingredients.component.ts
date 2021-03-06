import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { BaseComponent } from "src/app/base/base.component";
import { MealService } from "src/app/meal.service";
import { IngredientList } from "src/app/models/add.model";
import { Meal } from "src/app/models/repas.model";

import { AddService } from "../add.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "app-add-ingredients",
  templateUrl: "./add-ingredients.component.html",
  styleUrls: ["./add-ingredients.component.scss"]
})
export class AddIngredientsComponent extends BaseComponent implements OnInit {
  @Input() meal: Meal;
  @Input() classification: string;

  showError: boolean = false;
  errors: { name: string; validators: string[]; show: boolean }[];
  meals: Meal[] = [];
  typeArr: string[] = [
    "Produit laitier",
    "Légume",
    "Viande",
    "Poisson",
    "Fruit",
    "Épice",
    "Autre"
  ];
  unitArr: string[] = [
    "c. à thé",
    "c. à soupe",
    "ml",
    "l",
    "oz",
    "tasse",
    "g",
    "kg",
    "lb",
    "unité"
  ];

  // Forms
  ingredientForm = new FormGroup({
    ingredient: new FormControl("", Validators.required),
    ingType: new FormControl("", Validators.required),
    quantity: new FormControl("", Validators.required),
    unit: new FormControl("", Validators.required)
  });

  ingredientList: IngredientList[] = [];
  ingredientChoices: IngredientList[] = [];

  constructor(
    private addService: AddService,
    private mealService: MealService
  ) {
    super();
  }

  ngOnInit() {
    if (this.meal) {
      this.ingredientList = this.meal.ingredients;
    }
    this.addService.formErrors$
      .pipe(takeUntil(this.destroy$))
      .subscribe(errors => {
        this.errors = errors;
      });
    this.mealService.meals$.pipe(takeUntil(this.destroy$)).subscribe(meals => {
      this.meals = meals;
    });
  }

  get ingredient() {
    return this.ingredientForm.get("ingredient");
  }
  get ingType() {
    return this.ingredientForm.get("ingType");
  }
  get quantity() {
    return this.ingredientForm.get("quantity");
  }
  get unit() {
    return this.ingredientForm.get("unit");
  }

  submitIngredient(): void {
    if (this.ingredientForm.valid) {
      this.showError = false;
      this.setShowToFalse("ingredient");
      this.addIngredient();
    } else {
      this.addService.checkForErrorForm(this.ingredientForm);
      this.showError = true;
    }
  }

  addIngredient(): void {
    this.ingredientList.push({
      ingredient: this.ingredient.value,
      ingType: this.typeArr[this.ingType.value - 1].toLowerCase(),
      quantity: this.quantity.value,
      unit: this.unitArr[this.unit.value - 1].toLowerCase()
    });
    this.ingredient.setValue("");
    this.ingType.setValue("");
    this.quantity.setValue("");
    this.unit.setValue("");
  }

  removeIngredient(ingredient: IngredientList): void {
    this.ingredientList = this.ingredientList.filter(
      (ing: IngredientList) =>
        ing.ingredient !== ingredient.ingredient &&
        ing.quantity !== ingredient.quantity
    );
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }

  checkForSameIngredient(): string[] {
    const tempChoices = new Set();
    const ingredientChoices = [];
    this.meals.forEach(meal => {
      const sameIng = meal.ingredients.filter(ing =>
        ing.ingredient
          .toLowerCase()
          .startsWith(this.ingredient.value.toLowerCase())
      );
      if (sameIng.length > 0) {
        sameIng.forEach(el => tempChoices.add(JSON.stringify(el)));
      }
    });
    tempChoices.forEach((ing: string) => {
      this.ingredientChoices.push(JSON.parse(ing));
      ingredientChoices.push(JSON.parse(ing).ingredient);
    });
    return ingredientChoices;
  }

  itemSelected($event): void {
    let ingredient: any = this.ingredientChoices.filter(
      ing => ing.ingredient === $event.item
    )[0];

    let unit = ingredient.quantity;
    unit = unit.split(" ").pop();
    if (unit === "tasses") {
      unit = "tasse";
    }
    this.unit.setValue(this.unitArr.indexOf(unit) + 1);

    let type = ingredient.ingType;
    if (type === "dairy") {
      type = "Produit laitier";
    }
    type = type.charAt(0).toUpperCase() + type.slice(1);
    this.ingType.setValue(this.typeArr.indexOf(type) + 1);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        this.checkForSameIngredient()
          .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    );
}
