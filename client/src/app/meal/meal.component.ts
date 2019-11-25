import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { BaseComponent } from '../base/base.component';
import { MealService } from '../meal.service';
import { Meal } from '../models/repas.model';

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
}
