import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { Meal, Instruction } from 'src/app/models/repas.model';

@Component({
  selector: 'app-print-with-image',
  templateUrl: './print-with-image.component.html',
  styleUrls: ['./print-with-image.component.scss'],
})
export class PrintWithImageComponent extends BaseComponent implements OnInit {
  @Input() meal: Meal;
  prtWithPicture: boolean;

  form = new FormGroup({
    portion: new FormControl('', Validators.required),
  });

  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {}

  get portion() {
    return this.form.get('portion');
  }

  changeToModification(): void {
    this.router.navigateByUrl(
      `/modification/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}`,
    );
  }

  printWithPicture(res: boolean): void {
    this.prtWithPicture = res;
  }

  toFraction(portion: any): string {
    portion = portion.split(' ');

    let number = portion[0];
    const unit = portion[1];
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
