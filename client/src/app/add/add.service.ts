import { Injectable, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class AddService {
  imageUrl: any;
  formErrors$: BehaviorSubject<
    { name: string; validators: string[]; show: boolean }[]
  > = new BehaviorSubject([]);

  constructor() {}

  checkForErrorForm(form: FormGroup): number {
    const errors = [];
    Object.keys(form.controls).forEach(input => {
      if (form.controls[input].errors) {
        errors.push({
          name: input,
          validators: Object.keys(form.controls[input].errors),
          show: true,
        });
      }
    });
    if (this.formErrors$.value) {
      this.formErrors$.value.forEach(error => {
        const errorFiltered = errors.filter(err => err.name);
        if (errorFiltered.length > 0) {
          const index = this.formErrors$.value
            .map(each => each.name)
            .indexOf(error.name);
          if (index !== -1) {
            this.formErrors$.value[index].show = true;
          }
        }
      });
    }
    this.formErrors$.next(errors);
    return errors.length;
  }

  checkForErrorArray(name: string, arr: any): void {
    if (arr.length === 0) {
      const error = { name, validators: ['required'], show: true };
      this.formErrors$.next([...this.formErrors$.value, error]);
    }
  }

  getValues(components: any[]) {
    const values = {};
    components.forEach(component => {
      Object.keys(component.first).forEach(form => {
        if (
          form.toLowerCase().includes('form') &&
          !form.toLowerCase().includes('error')
        ) {
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

  getFormErrors(input: string): boolean {
    for (const error of this.formErrors$.value) {
      if (error.name === input && error.show === true) {
        return true;
      }
    }
    return false;
  }

  setShowToFalse(input: string): void {
    for (const error of this.formErrors$.value) {
      if (error.name === input) {
        error.show = false;
        break;
      }
    }
  }
}
