import { Component, OnInit, Input } from '@angular/core';
import { Meal, Ingredients } from 'src/app/models/repas.model';
import { stringify } from 'querystring';

@Component({
  selector: 'app-meal-ingredients',
  templateUrl: './meal-ingredients.component.html',
  styleUrls: ['./meal-ingredients.component.scss'],
})
export class MealIngredientsComponent implements OnInit {
  @Input() meal: Meal;
  @Input() classification: string;

  groupedByIngredients: Ingredients[];

  constructor() {}

  ngOnInit() {}

  groupBy(): Ingredients[] {
    if (!this.groupedByIngredients) {
      const res = [];
      const categories = [
        'viande',
        'poisson',
        'légume',
        'fruit',
        'dairy',
        'spice',
        'autre',
      ];
      categories.forEach(cat => {
        const ings = this.meal.ingredients.filter(
          (ing: Ingredients) => ing.ingType === cat,
        );
        if (ings.length & 1) {
          ings.push({
            ingredient: '',
            quantity: '',
            ingType: '',
            unit: '',
            disabled: false,
          });
        }
        res.push(...ings);
      });
      this.groupedByIngredients = res;
      return res;
    } else {
      return this.groupedByIngredients;
    }
  }

  toFraction(portion: any): string {
    portion = portion.split(' ');
    let number = portion[0];
    const unit = portion.slice(-1).join('');
    let fraction: any;
    number = number.toString();
    if (number.includes('/')) {
      number = eval(number).toString();
    }
    if (number.includes('.')) {
      fraction = number.split('.')[1];
      if (fraction.length > 2) {
        fraction = Number(fraction.slice(0, 2));
      } else if (fraction.length === 1) {
        fraction = Number(fraction.padEnd(2, 0));
      } else {
        fraction = +fraction;
      }
      number = number.split('.')[0];
      if (fraction >= 0 && fraction <= 13) fraction = '';
      if (fraction > 13 && fraction <= 29) fraction = ' ¼';
      if (fraction > 29 && fraction <= 41) fraction = ' ⅓';
      if (fraction > 41 && fraction <= 58) fraction = ' ½';
      if (fraction > 59 && fraction <= 70) fraction = ' ⅔';
      if (fraction > 70 && fraction <= 88) fraction = ' ¾';
      if (fraction > 88) {
        number = +number + 1;
        fraction = '';
      }
    }

    if (fraction === undefined) fraction = '';
    if (+number === 0) number = '';
    return `${number}${fraction} ${unit}`;
  }
}
