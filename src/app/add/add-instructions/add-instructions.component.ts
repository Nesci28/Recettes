import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AddService } from "../add.service";
import { ActivatedRoute } from "@angular/router";
import { MealService } from "src/app/meal.service";

@Component({
  selector: "app-add-instructions",
  templateUrl: "./add-instructions.component.html",
  styleUrls: ["./add-instructions.component.scss"]
})
export class AddInstructionsComponent implements OnInit {
  @ViewChild("instruction", { static: false }) instructionRef: ElementRef;

  // Forms
  instructionForm = new FormGroup({
    instruction: new FormControl("", Validators.required)
  });

  instructionList: { instruction: string }[] = [];

  constructor(
    private addService: AddService,
    private router: ActivatedRoute,
    private mealService: MealService
  ) {}

  ngOnInit() {
    if (this.router.snapshot.url[0].path === "modification") {
      this.instructionList = this.mealService.meal.instructions;
    }
  }

  get instruction() {
    return this.instructionForm.get("instruction");
  }

  submitInstruction(): void {
    const errors = this.addService.checkForErrorForm(this.instructionForm);
    if (errors.length === 0) {
      this.addInstruction();
    }
  }

  addInstruction(): void {
    this.instructionList.push({
      instruction: this.instruction.value
    });
    this.instructionForm.reset();
    this.instructionRef.nativeElement.focus();
  }

  removeInstruction(instruction): void {
    this.instructionList = this.instructionList.filter(
      el => el.instruction !== instruction.instruction
    );
  }
}
