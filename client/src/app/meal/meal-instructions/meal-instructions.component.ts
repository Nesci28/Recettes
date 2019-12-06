import { Component, OnInit, Input } from '@angular/core';
import { Meal, Instruction } from 'src/app/models/repas.model';

@Component({
  selector: 'app-meal-instructions',
  templateUrl: './meal-instructions.component.html',
  styleUrls: ['./meal-instructions.component.scss'],
})
export class MealInstructionsComponent implements OnInit {
  @Input() meal: Meal;

  constructor() {}

  ngOnInit() {}

  instructionListGrouped(): Instruction[] {
    const res = [];
    const titlesSet = new Set();
    const titles = this.meal.instructions.map(ins => ins.title);
    titles.forEach(title => titlesSet.add(title));
    titlesSet.forEach(title => {
      res.push(this.meal.instructions.filter(ins => ins.title === title));
    });
    return res;
  }
}
