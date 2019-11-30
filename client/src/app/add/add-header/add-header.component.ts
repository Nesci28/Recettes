import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { BaseComponent } from 'src/app/base/base.component';
import { Meal } from 'src/app/models/repas.model';

import { AddService } from '../add.service';

@Component({
  selector: 'app-add-header',
  templateUrl: './add-header.component.html',
  styleUrls: ['./add-header.component.scss'],
})
export class AddHeaderComponent extends BaseComponent implements OnInit {
  @ViewChild('name', { static: false }) nameRef: ElementRef;
  @Input() meal: Meal;

  formErrors: { name: string; validators: string[]; show: boolean }[];
  nameForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    portion: new FormControl('', Validators.required),
  });

  constructor(private addService: AddService) {
    super();
  }

  ngOnInit() {
    if (this.meal) {
      this.name.setValue(this.meal.name);
      this.type.setValue(this.meal.type);
      this.description.setValue(this.meal.description);
      this.portion.setValue(this.meal.portion);
    }
    this.addService.formErrors$
      .pipe(takeUntil(this.destroy$))
      .subscribe(errors => {
        this.formErrors = errors;
      });
  }

  get name() {
    return this.nameForm.get('name');
  }
  get type() {
    return this.nameForm.get('type');
  }
  get description() {
    return this.nameForm.get('description');
  }
  get portion() {
    return this.nameForm.get('portion');
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }
}
