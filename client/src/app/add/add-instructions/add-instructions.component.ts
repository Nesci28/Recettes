import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddService } from '../add.service';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/meal.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-add-instructions',
  templateUrl: './add-instructions.component.html',
  styleUrls: ['./add-instructions.component.scss'],
})
export class AddInstructionsComponent extends BaseComponent implements OnInit {
  @ViewChild('instruction', { static: false }) instructionRef: ElementRef;

  errors: { name: string; validators: string[]; show: boolean }[];

  // Forms
  instructionForm = new FormGroup({
    instruction: new FormControl('', Validators.required),
  });

  instructionList: { instruction: string }[] = [];

  constructor(
    private addService: AddService,
    private router: ActivatedRoute,
    private mealService: MealService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.router.snapshot.url[0].path === 'modification') {
      this.instructionList = this.mealService.meal.instructions;
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
      this.setShowToFalse('instruction');
      this.addInstruction();
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
