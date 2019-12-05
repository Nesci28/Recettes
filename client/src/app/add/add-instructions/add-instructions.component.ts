import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base/base.component';
import { Meal, Instruction } from 'src/app/models/repas.model';

import { AddService } from '../add.service';
import { asLiteral } from '@angular/compiler/src/render3/view/util';

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
          [ngClass]="{
            'is-invalid':
              (description.invalid &&
                (description.dirty || description.touched)) ||
              error
          }"
          value="{{ instruction }}"
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
  @Input() instruction: string;
  @Output() passEntry: EventEmitter<string> = new EventEmitter();

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
      this.passEntry.emit(this.description.value);
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

  showError = {
    title: false,
    instruction: false,
  };
  errors: { name: string; validators: string[]; show: boolean }[];

  // Forms
  instructionForm = new FormGroup({
    instruction: new FormControl('', Validators.required),
  });

  form = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  instructionList: { title: string; instruction: string }[] = [];
  titleSet: Set<string> = new Set();
  showTitle: boolean = false;

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
  get title() {
    return this.form.get('title');
  }

  submitInstruction(): void {
    if (this.instructionForm.valid && this.form.valid) {
      this.showError.instruction = false;
      this.showError.title = false;
      this.setShowToFalse('instruction');
      this.addInstruction();
    } else {
      if (!this.instructionForm.valid) {
        this.showError.instruction = true;
      }
      if (!this.form.valid) {
        this.showError.title = true;
      }
    }
  }

  addInstruction(): void {
    this.showTitle = false;
    this.instructionList.push({
      title: this.title.value,
      instruction: this.instruction.value,
    });
    if (!this.titleSet.has(this.title.value)) {
      this.showTitle = true;
      this.titleSet.add(this.title.value);
    }
    this.instructionForm.reset();
    this.instructionRef.nativeElement.focus();
  }

  removeInstruction(instruction): void {
    this.instructionList = this.instructionList.filter(
      el => el.instruction !== instruction.instruction,
    );
  }

  open(instruction: string) {
    const modalRef = this.modalService.open(NgbdEditInstructionModal);
    modalRef.componentInstance.instruction = instruction;
    modalRef.componentInstance.passEntry.subscribe((res: string) => {
      this.meal.instructions.forEach(ins => {
        if (ins.instruction === instruction) {
          ins.instruction = res;
        }
      });
    });
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  setShowToFalse(input: string): void {
    this.addService.setShowToFalse(input);
  }

  instructionListGrouped(): Instruction[] {
    const res = [];
    const titlesSet = new Set();
    const titles = this.instructionList.map(ins => ins.title);
    titles.forEach(title => titlesSet.add(title));
    titlesSet.forEach(title => {
      res.push(this.instructionList.filter(ins => ins.title === title));
    });
    return res;
  }
}
