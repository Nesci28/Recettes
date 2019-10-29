import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { AddHeaderComponent } from "./add-header/add-header.component";
import { AddService } from "./add.service";
import { AddIngredientsComponent } from "./add-ingredients/add-ingredients.component";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  @ViewChildren(AddHeaderComponent) addHeaderComponent: QueryList<
    AddHeaderComponent
  >;
  @ViewChildren(AddIngredientsComponent) addIngredientsComponent: QueryList<
    AddIngredientsComponent
  >;

  constructor(private addService: AddService) {}

  ngOnInit() {}

  onSubmit(form: FormGroup, type: string) {
    const errors = this.addService.checkForErrorComponent([
      this.addHeaderComponent
    ]);
    console.log("errors :", errors);
    if (errors.length === 0) {
      const values = this.addService.getValues([this.addHeaderComponent]);
      console.log("values :", values);
      console.log("sent!");
    }
  }
}
