import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class AddService {
  imageUrl: any;

  constructor() {}

  checkForErrorForm(form: FormGroup) {
    const errors = [];
    Object.keys(form.controls).forEach(input => {
      if (form.controls[input].errors) {
        errors.push({
          name: input,
          validators: Object.keys(form.controls[input].errors)
        });
      }
    });
    return errors;
  }

  checkForErrorComponent(components) {
    const errors = [];
    components.forEach(component => {
      Object.keys(component.first).forEach(form => {
        if (form !== "addService") {
          Object.keys(component.first[form].controls).forEach(input => {
            if (component.first[form].get(input).errors) {
              errors.push({
                name: input,
                validators: Object.keys(component.first[form].get(input).errors)
              });
            }
          });
        }
      });
    });
    return errors;
  }

  getValues(components) {
    const values = {};
    components.forEach(component => {
      Object.keys(component.first).forEach(form => {
        if (form !== "addService") {
          console.log("form :", form);
          Object.keys(component.first[form].controls).forEach(input => {
            if (!values[form]) {
              values[form] = {};
            }
            values[form][input] = component.first[form].get(input).value;
          });
        }
      });
    });
    return values;
  }
}
