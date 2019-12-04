import { Component, Input, OnInit } from '@angular/core';

import { MealService } from '../../../meal.service';
import { Meal } from '../../../models/repas.model';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.scss'],
})
export class ListBookComponent implements OnInit {
  @Input() selectedMeals: Meal[];
  @Input() meals: Meal[];

  book: Meal[] = [];
  bookSelected: { id: number }[] = [];

  constructor(private mealService: MealService) {}

  ngOnInit() {
    this.meals.forEach(meal => {
      meal.selected = false;
    });
  }

  getMeal(repas: Meal): void {
    if (this.bookSelected.filter(e => e.id === repas.id).length === 0) {
      this.mealService.book.push(repas);
      this.bookSelected.push({ id: repas.id });
    } else {
      this.bookSelected = this.bookSelected.filter(e => e.id !== repas.id);
      this.mealService.book = this.mealService.book.filter(
        e => e.id !== repas.id,
      );
    }
  }

  getMealCategory(index: number): Meal[] {
    return this.meals.filter(
      meal => meal.type === index.toString() && meal.filtered === false,
    );
  }

  getName(name: string): string {
    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
  }
}
