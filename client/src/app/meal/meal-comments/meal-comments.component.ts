import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpCallService } from 'src/app/http-call.service';
import { Meal } from 'src/app/models/repas.model';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { BaseComponent } from 'src/app/base/base.component';
import { MealService } from 'src/app/meal.service';

@Component({
  selector: 'app-meal-comments',
  templateUrl: './meal-comments.component.html',
  styleUrls: ['./meal-comments.component.scss'],
})
export class MealCommentsComponent extends BaseComponent implements OnInit {
  @Input() meal: Meal;

  error: boolean = false;
  collapsed: boolean = false;

  form = new FormGroup({
    comment: new FormControl('', Validators.required),
  });

  constructor(
    private httpService: HttpCallService,
    private mealService: MealService,
  ) {
    super();
  }

  ngOnInit() {}

  get comment() {
    return this.form.get('comment');
  }

  submit(): void {
    console.log('this.meal :', this.meal);
    if (this.form.valid) {
      this.error = false;
      this.mealService.meal.comments.push(this.comment.value);
      this.httpService
        .addComment(this.meal.id, this.comment.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(_ => {});
    } else {
      this.error = true;
    }
  }

  setErrorToFalse(): void {
    this.error = false;
  }
}
