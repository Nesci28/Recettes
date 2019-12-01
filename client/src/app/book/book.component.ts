import { Component, OnInit } from '@angular/core';

import { MealService } from '../meal.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  noneSelectedError: boolean = false;

  constructor(private mealService: MealService) {}

  ngOnInit() {}

  generatePDF(): void {
    if (this.mealService.book.length === 0) {
      this.noneSelectedError = true;
    } else {
      this.noneSelectedError = false;
      console.log('Book :', this.mealService.book);
    }
  }

  dismissError(): void {
    this.noneSelectedError = false;
  }
}
