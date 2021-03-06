import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { BaseComponent } from '../base/base.component';
import { MealService } from '../meal.service';
import { Meal } from '../models/repas.model';
import { HttpCallService } from '../http-call.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'gbd-cropper-modal',
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
      <form [formGroup]="form">
        <input
          type="text"
          class="w-100"
          placeholder="Mot de passe"
          formControlName="password"
        />
        <div
          *ngIf="
            (password.invalid && (password.dirty || password.touched)) ||
            this.error
          "
        >
          <span class="badge badge-danger w-100 px-0 d-block"
            >Entrer le mot de passe</span
          >
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <div class="w-100 d-flex justify-content-between">
        <button
          class="btn btn-outline-dark"
          (click)="activeModal.dismiss('non')"
        >
          Non
        </button>
        <button type="button" class="btn btn-dark" (click)="deleteMeal()">
          Oui
        </button>
      </div>
    </div>
  `,
})
export class NgbdDeleteModal extends BaseComponent {
  @Input() meal: Meal;

  error: boolean = false;

  form = new FormGroup({
    password: new FormControl('', Validators.required),
  });

  constructor(
    public activeModal: NgbActiveModal,
    private httpService: HttpCallService,
    private router: Router,
    private mealService: MealService,
  ) {
    super();
  }

  get password() {
    return this.form.get('password');
  }

  deleteMeal(): void {
    if (this.password.value) {
      this.error = false;
      this.mealService.loading$.next(true);
      this.httpService
        .getConfirmation(this.password.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: string) => {
          if (res === 'confirmed') {
            const type = this.meal.type;
            this.httpService
              .deleteMeal(this.meal)
              .pipe(takeUntil(this.destroy$))
              .subscribe(_ => {
                this.activeModal.dismiss('');
                this.router.navigate(['/liste', type]);
                this.mealService.loading$.next(false);
              });
          } else {
            this.error = true;
            this.mealService.loading$.next(false);
          }
        });
    } else {
      this.error = true;
    }
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
    classification: new FormControl('type'),
  });

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private httpCallService: HttpCallService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.mealService.meal) {
      this.meal = this.mealService.meal;
    } else if (this.mealService.meals$.value.length > 0) {
      this.mealService.meals$
        .pipe(takeUntil(this.destroy$))
        .subscribe((meals: Meal[]) => {
          const { id, type } = this.route.snapshot.params;
          const meal = meals.filter(m => +m.id === +id && +m.type === +type);
          if (meal.length > 0) {
            this.meal = meal[0];
          }
        });
    } else {
      this.mealService.loading$.next(true);
      this.httpCallService
        .getMeal(this.route.snapshot.params.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(meal => {
          this.mealService.meal = meal[0];
          this.mealService.loading$.next(false);
          this.meal = meal[0];
        });
    }
  }

  get classification() {
    return this.form.get('classification');
  }

  changeToModification(): void {
    this.router.navigateByUrl(
      `/modification/${this.route.snapshot.params.type}/${this.route.snapshot.params.id}`,
    );
  }

  async modalDelete() {
    const modalRef = this.modalService.open(NgbdDeleteModal);
    modalRef.componentInstance.meal = this.meal;
  }

  printWithPicture(res: boolean): void {
    this.prtWithPicture = res;
  }
}
