import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

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

  constructor() {}

  ngOnInit() {}

  get name() {
    return this.nameForm.get("name");
  }
  get type() {
    return this.nameForm.get("type");
  }
  get description() {
    return this.nameForm.get("description");
  }
}
