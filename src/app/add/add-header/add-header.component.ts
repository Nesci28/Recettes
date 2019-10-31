import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MealService } from "src/app/meal.service";

@Component({
  selector: "app-add-header",
  templateUrl: "./add-header.component.html",
  styleUrls: ["./add-header.component.scss"]
})
export class AddHeaderComponent implements OnInit {
  nameForm = new FormGroup({
    name: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required)
  });

  constructor(
    private router: ActivatedRoute,
    private mealService: MealService
  ) {}

  ngOnInit() {
    if (this.router.snapshot.url[0].path === "modification") {
      this.nameForm.controls["name"].setValue(this.mealService.meal.name);
      this.nameForm.controls["type"].setValue(
        this.getType(this.mealService.meal.type)
      );
      this.nameForm.controls["description"].setValue(
        this.mealService.meal.description
      );
    }
  }

  get name() {
    return this.nameForm.get("name");
  }
  get type() {
    return this.nameForm.get("type");
  }
  get description() {
    return this.nameForm.get("description");
  }

  getType(str: string): number {
    return this.mealService.meal.type === "Entrée"
      ? 1
      : this.mealService.meal.type === "Principal"
      ? 2
      : 3;
  }
}
