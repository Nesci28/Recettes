import { Component, OnInit } from "@angular/core";

import data from "./list/meals.json";
import { Meal } from "./models/repas.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "Recettes de la Famille Harvey";
  isNavbarCollapsed = true;
  meals: Meal[] = data;

  query: string;

  constructor() {}

  ngOnInit() {}

  search(): void {
    console.log("this.query :", this.query);
  }
}
