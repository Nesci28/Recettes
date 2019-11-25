import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/meal.service';
import { BaseComponent } from 'src/app/base/base.component';
import { AddService } from '../add.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Meal } from 'src/app/models/repas.model';

@Component({
  selector: 'app-add-header',
  templateUrl: './add-header.component.html',
  styleUrls: ['./add-header.component.scss'],
})
export class AddHeaderComponent extends BaseComponent implements OnInit {
  @ViewChild('name', { static: false }) nameRef: ElementRef;
  meal: Meal;

  formErrors: { name: string; validators: string[]; show: boolean }[];
  nameForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    portion: new FormControl('', Validators.required),
  });

  constructor(
    private addService: AddService,
    private mealService: MealService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.mealService.meals$
        .pipe(takeUntil(this.destroy$))
        .subscribe((meals: Meal[]) => {
          const { id, type } = this.route.snapshot.params;
          const meal = meals.filter(
            meal => +meal.id === +id && +meal.type === +type,
          );
          if (meal.length > 0) {
            this.meal = meal[0];
            this.name.setValue(this.meal.name);
            this.type.setValue(this.meal.type);
            this.description.setValue(this.meal.description);
            this.portion.setValue(this.meal.portion);
            this.cdr.detectChanges();
          }
        });
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
