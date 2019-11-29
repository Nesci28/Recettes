import { Component, OnInit, Input } from '@angular/core';
import { Meal } from 'src/app/models/repas.model';

@Component({
  selector: 'app-meal-image',
  templateUrl: './meal-image.component.html',
  styleUrls: ['./meal-image.component.scss'],
})
export class MealImageComponent implements OnInit {
  @Input() meal: Meal;

  constructor() {}

  ngOnInit() {}
}
