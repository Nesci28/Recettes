import { Component, OnInit, QueryList } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IngredientList } from "src/app/models/add.model";
import { AddService } from "../add.service";
import { ActivatedRoute } from "@angular/router";
import { MealService } from "src/app/meal.service";

@Component({
  selector: "app-add-ingredients",
  templateUrl: "./add-ingredients.component.html",
  styleUrls: ["./add-ingredients.component.scss"]
})
export class AddIngredientsComponent implements OnInit {
  typeArr: string[] = ["Produit laitier", "Légume", "Viande", "Fruit", "Autre"];
  unitArr: string[] = [
    "c. à thé",
    "c. à soupe",
    "ml",
    "l",
    "oz",
    "tasse",
    "g",
    "kg",
    "lb"
  ];

  // Forms
  ingredientForm = new FormGroup({
    ingredient: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    quantity: new FormControl("", Validators.required),
    unit: new FormControl("", Validators.required)
  });

  ingredientList: IngredientList[] = [];

  constructor(
    private addService: AddService,
    private router: ActivatedRoute,
    private mealService: MealService
  ) {}

  ngOnInit() {
    if (this.router.snapshot.url[0].path === "modification") {
      this.ingredientList = this.mealService.meal.ingredients;
    }
  }

  get ingredient() {
    return this.ingredientForm.get("ingredient");
  }
  get type() {
    return this.ingredientForm.get("type");
  }
  get quantity() {
    return this.ingredientForm.get("quantity");
  }
  get unit() {
    return this.ingredientForm.get("unit");
  }

  submitIngredient(): void {
    const errors = this.addService.checkForErrorForm(this.ingredientForm);
    if (errors.length === 0) {
      this.addIngredient();
    }
  }

  addIngredient(): void {
    this.ingredientList.push({
      ingredient: this.ingredient.value,
      type: this.typeArr[this.type.value - 1].toLowerCase(),
      quantity: this.quantity.value,
      unit: this.unitArr[this.unit.value - 1].toLowerCase()
    });
    this.ingredientForm.reset();
  }

  removeIngredient(ingredient: IngredientList): void {
    this.ingredientList = this.ingredientList.filter(
      e => e.ingredient !== ingredient.ingredient
    );
  }
}
