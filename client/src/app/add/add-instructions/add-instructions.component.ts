import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddService } from '../add.service';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/meal.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base/base.component';
import { Meal } from 'src/app/models/repas.model';

@Component({
  selector: 'app-add-instructions',
  templateUrl: './add-instructions.component.html',
  styleUrls: ['./add-instructions.component.scss'],
})
export class AddInstructionsComponent extends BaseComponent implements OnInit {
  @Input() meal: Meal;
  @ViewChild('instruction', { static: false }) instructionRef: ElementRef;

  showError: boolean = false;
  errors: { name: string; validators: string[]; show: boolean }[];

  // Forms
  instructionForm = new FormGroup({
    instruction: new FormControl('', Validators.required),
  });

  instructionList: { instruction: string }[] = [];

  constructor(
    private addService: AddService,
    private route: ActivatedRoute,
    private mealService: MealService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.mealService.meals$
        .pipe(takeUntil(this.destroy$))
        .subscribe((meals: Meal[]) => {
          const { id, type } = this.route.snapshot.params;
          const meal = meals.filter(
            meal => +meal.id === +id && +meal.type === +type,
          );
          if (meal.length > 0) {
            this.meal = meal[0];
            this.instructionList = this.meal.instructions;
            this.cdr.detectChanges();
          }
        });
    }
    this.addService.formErrors$
      .pipe(takeUntil(this.destroy$))
      .subscribe(errors => {
        this.errors = errors;
      });
  }

  get instruction() {
    return this.instructionForm.get('instruction');
  }

  submitInstruction(): void {
    if (this.instructionForm.valid) {
      this.showError = false;
      this.setShowToFalse('instruction');
      this.addInstruction();
    } else {
      this.showError = true;
    }
  }

  addInstruction(): void {
    this.instructionList.push({
      instruction: this.instruction.value,
    });
    this.instructionForm.reset();
    this.instructionRef.nativeElement.focus();
  }

  removeInstruction(instruction): void {
    this.instructionList = this.instructionList.filter(
      el => el.instruction !== instruction.instruction,
    );
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }
}
