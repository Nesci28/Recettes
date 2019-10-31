import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import data from "../assets/meals.json";
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

  constructor(private router: Router) {}

  ngOnInit() {}

  search(): void {
    const query = this.query;
    this.query = "";
    this.router.navigateByUrl(`/recherche/${query}`);
  }
}
