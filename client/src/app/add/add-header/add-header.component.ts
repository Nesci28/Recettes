import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/meal.service';
import { BaseComponent } from 'src/app/base/base.component';
import { AddService } from '../add.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-add-header',
  templateUrl: './add-header.component.html',
  styleUrls: ['./add-header.component.scss'],
})
export class AddHeaderComponent extends BaseComponent implements OnInit {
  formErrors: { name: string; validators: string[]; show: boolean }[];
  nameForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private router: ActivatedRoute,
    private mealService: MealService,
    private addService: AddService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.router.snapshot.url[0].path === 'modification') {
      this.nameForm.controls['name'].setValue(this.mealService.meal.name);
      this.nameForm.controls['type'].setValue(
        this.getType(this.mealService.meal.type),
      );
      this.nameForm.controls['description'].setValue(
        this.mealService.meal.description,
      );
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

  getType(str: string): number {
    return this.mealService.meal.type === 'Entrée'
      ? 1
      : this.mealService.meal.type === 'Principal'
      ? 2
      : 3;
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }
}
