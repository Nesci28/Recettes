import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MealService } from 'src/app/meal.service';
import { Meal } from 'src/app/models/repas.model';

@Component({
  selector: 'app-meal-header',
  templateUrl: './meal-header.component.html',
  styleUrls: ['./meal-header.component.scss'],
})
export class MealHeaderComponent implements OnInit {
  @Input() meal: Meal;

  @Output() deleteModalEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() modificationModalEvent: EventEmitter<void> = new EventEmitter<
    void
  >();

  form = new FormGroup({
    portion: new FormControl('', Validators.required),
  });

  constructor(private mealService: MealService) {}

  ngOnInit() {
    this.mealService.portion$.next(+this.meal.portion);
  }

  get portion() {
    return this.form.get('portion');
  }

  changePortion(): void {
    if (this.meal.portion) {
      this.meal.ingredients.forEach(ing => {
        const unit = ing.quantity.split(' ')[1];
        const evaluated = eval(ing.quantity.split(' ')[0]);
        let newValue: any =
          (this.portion.value * +evaluated) / this.meal.portion;
        newValue = newValue.toFixed(3);
        ing.quantity = `${newValue} ${unit}`;
      });
      this.meal.portion = this.portion.value;
    }
  }

  // Modal Event
  modalDelete() {
    this.deleteModalEvent.emit();
  }

  changeToModification() {
    this.modificationModalEvent.emit();
  }
}
