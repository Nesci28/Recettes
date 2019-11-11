import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base/base.component';
import { Meal } from '../models/repas.model';
import { AddHeaderComponent } from './add-header/add-header.component';
import { AddIngredientsComponent } from './add-ingredients/add-ingredients.component';
import { AddService } from './add.service';
import { HttpCallService } from '../http-call.service';
import { AddInstructionsComponent } from './add-instructions/add-instructions.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent extends BaseComponent implements OnInit {
  @ViewChildren(AddHeaderComponent) addHeaderComponent: QueryList<
    AddHeaderComponent
  >;
  @ViewChildren(AddIngredientsComponent) addIngredientsComponent: QueryList<
    AddIngredientsComponent
  >;
  @ViewChildren(AddInstructionsComponent) addInstructionsComponent: QueryList<
    AddInstructionsComponent
  >;

  meal: Meal;

  constructor(
    private addService: AddService,
    private router: ActivatedRoute,
    private httpCallService: HttpCallService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.router.snapshot.params.id) {
      this.httpCallService.getMeal().subscribe(meals => {
        this.meal = meals.filter(
          meal => meal.id === +this.router.snapshot.params.id,
        );
      });
    }
  }

  onSubmit() {
    const errors = this.addService.checkForErrorForm(
      this.addHeaderComponent.last.nameForm,
    );
    this.addService.checkForErrorArray(
      'ingredient',
      this.addIngredientsComponent.last.ingredientList,
    );
    this.addService.checkForErrorArray(
      'instruction',
      this.addInstructionsComponent.last.instructionList,
    );
    if (
      errors === 0 &&
      this.addIngredientsComponent.last.ingredientList.length > 0
    ) {
      const values = this.addService.getValues([this.addHeaderComponent]);
      console.log('values :', values);
      console.log('sent!');
    } else {
      console.log('errors :', errors);
    }
  }
}
