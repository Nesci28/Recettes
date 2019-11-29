import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { BaseComponent } from '../base/base.component';
import { MealService } from '../meal.service';
import { Meal } from '../models/repas.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'ngbd-cropper-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Confirmation</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Voulez-vous vraiment effacer cette recette?</p>
    </div>
    <div class="modal-footer">
      <div class="w-100 d-flex justify-content-between">
        <button
          class="btn btn-outline-dark"
          (click)="activeModal.dismiss('non')"
        >
          Non
        </button>
        <button type="button" class="btn btn-dark" (click)="save()">
          Oui
        </button>
      </div>
    </div>
  `,
})
export class NgbdDeleteModal {
  constructor(public activeModal: NgbActiveModal) {}

  save(): void {
    console.log('Effacer la recette');
  }
}

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss'],
})
export class MealComponent extends BaseComponent implements OnInit {
  meal: Meal;
  prtWithPicture: boolean;

  form = new FormGroup({
    portion: new FormControl('', Validators.required),
  });

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    if (this.mealService.meal) {
      this.meal = this.mealService.meal;
    } else {
      this.mealService.meals$
        .pipe(takeUntil(this.destroy$))
        .subscribe((meals: Meal[]) => {
          const { id, type } = this.route.snapshot.params;
          const meal = meals.filter(m => +m.id === +id && +m.type === +type);
          if (meal.length > 0) {
            this.meal = meal[0];
          }
        });
    }
  }

  get portion() {
    return this.form.get('portion');
  }

  getImage(): string {
    if (this.meal.image) {
      return 'this.meal.image';
    } else {
      return `../../../assets/giphy.gif`;
    }
  }

  changeToModification(): void {
    this.router.navigateByUrl(
      `/modification/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}`,
    );
  }

  async modalDelete() {
    await this.modalService.open(NgbdDeleteModal).result.then(
      _ => {},
      _ => {},
    );
  }

  printWithPicture(res: boolean): void {
    this.prtWithPicture = res;
  }

  changePortion(): void {
    if (this.meal.portion) {
      this.meal.ingredients.forEach(ing => {
        const original = this.meal.ingredients
          .filter(e => e.ingredient === ing.ingredient)[0]
          .quantity.split(' ');
        const value = eval(original.slice(0, -1).join(''));
        const unit = original.slice(-1).join('');

        let newValue: any = (this.portion.value * +value) / this.meal.portion;
        newValue = newValue.toFixed(3);
        ing.quantity = `${newValue} ${unit}`;
      });
      this.meal.portion = this.portion.value;
    }
  }

  toFraction(portion: any): string {
    portion = portion.split(' ');

    let number = portion.slice(0, -1).join('');
    const unit = portion.slice(-1).join('');
    let fraction;
    number = number.toString();
    if (number.includes('/')) {
      number = eval(number).toString();
    }
    if (number.includes('.')) {
      fraction = Number(number.split('.')[1].padEnd(2, 0));
      number = number.split('.')[0];

      if (fraction >= 0 && fraction <= 13) fraction = '';
      if (fraction > 13 && fraction <= 29) fraction = ' 1/4';
      if (fraction > 29 && fraction <= 41) fraction = ' 1/3';
      if (fraction > 41 && fraction <= 58) fraction = ' 1/2';
      if (fraction > 59 && fraction <= 70) fraction = ' 2/3';
      if (fraction > 70 && fraction <= 88) fraction = ' 3/4';
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
