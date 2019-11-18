import { Component, OnInit, Input } from '@angular/core';
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
  @Input() meal: Meal;

  formErrors: { name: string; validators: string[]; show: boolean }[];
  nameForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private router: ActivatedRoute, private addService: AddService) {
    super();
  }

  ngOnInit() {
    if (this.router.snapshot.url[0].path === 'modification') {
      this.name.setValue(this.meal.name);
      this.type.setValue(this.getType(this.meal.type));
      this.description.setValue(this.meal.description);
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

  getType(str: string): string {
    return str === 'Entrée' ? '1' : str === 'Principal' ? '2' : '3';
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }
}
