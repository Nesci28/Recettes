import { Component, OnInit, Input } from '@angular/core';
import { Meal } from 'src/app/models/repas.model';

@Component({
  selector: 'app-meal-instructions',
  templateUrl: './meal-instructions.component.html',
  styleUrls: ['./meal-instructions.component.scss'],
})
export class MealInstructionsComponent implements OnInit {
  @Input() meal: Meal;

  constructor() {}

  ngOnInit() {}
}
