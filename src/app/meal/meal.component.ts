import { Component, OnInit } from "@angular/core";
import { MealService } from "../meal.service";
import { Meal } from "../models/repas.model";

@Component({
  selector: "app-meal",
  templateUrl: "./meal.component.html",
  styleUrls: ["./meal.component.scss"]
})
export class MealComponent implements OnInit {
  meal: Meal;

  constructor(private mealService: MealService) {}

  ngOnInit() {
    this.meal = this.mealService.meal;
  }

  getImage(): string {
    return `../../assets/${this.mealService.meal.name
      .toLowerCase()
      .replace(/ /g, "_")}.jpg`;
  }
}
