import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base/base.component';
import { Meal } from 'src/app/models/repas.model';
import { AddService } from '../add.service';

@Component({
  selector: 'ngbd-cropper-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Modifier l'instruction</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('cancel')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form [formGroup]="form">
        <textarea
          class="form-control"
          rows="4"
          formControlName="description"
          placeholder="Description"
          [ngClass]="{
            'is-invalid':
              (description.invalid &&
                (description.dirty || description.touched)) ||
              error
          }"
        ></textarea>
      </form>
    </div>
    <div class="modal-footer">
      <div class="w-100 d-flex justify-content-between">
        <button class="btn btn-info" (click)="activeModal.dismiss('cancel')">
          Cancel
        </button>
        <button type="button" class="btn btn-success" (click)="save()">
          Sauvegarder
        </button>
      </div>
    </div>
  `,
})
export class NgbdEditInstructionModal {
  error: boolean = false;

  form = new FormGroup({
    description: new FormControl('', Validators.required),
  });

  constructor(public activeModal: NgbActiveModal) {}

  get description() {
    return this.form.get('description');
  }

  save(): void {
    if (!this.description.errors) {
      this.activeModal.dismiss(this.description.value);
    } else {
      this.error = true;
    }
  }
}

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

  constructor(private addService: AddService, private modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    if (this.meal) {
      this.instructionList = this.meal.instructions;
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

  async open(instruction: string) {
    console.log('instruction :', instruction);
    await this.modalService.open(NgbdEditInstructionModal).result.then(
      _ => {},
      res => {
        if (res !== 'cancel' && res !== 0) {
          this.meal.instructions.forEach(ins => {
            if (ins.instruction === instruction) {
              ins.instruction = res;
            }
          });
        }
      },
    );
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }
}
