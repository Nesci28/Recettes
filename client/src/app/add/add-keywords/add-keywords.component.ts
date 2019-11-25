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
import { Meal } from 'src/app/models/repas.model';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-add-keywords',
  templateUrl: './add-keywords.component.html',
  styleUrls: ['./add-keywords.component.scss'],
})
export class AddKeywordsComponent extends BaseComponent implements OnInit {
  @Input() meal: Meal;
  @ViewChild('keyword', { static: false }) keywordRef: ElementRef;
  @ViewChild('secondLife', { static: false }) secondLifeRef: ElementRef;

  // Forms
  keywordForm = new FormGroup({
    keyword: new FormControl('', Validators.required),
  });
  secondLifeForm = new FormGroup({
    secondLife: new FormControl('', Validators.required),
  });

  showError = {
    keyword: false,
    secondLife: false,
  };

  keywordsList: string[] = [];
  secondLifeList: string[] = [];

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
            this.keywordsList = this.meal.keywords;
            this.secondLifeList = this.meal.secondLife;
            this.cdr.detectChanges();
          }
        });
    }
  }

  get keyword() {
    return this.keywordForm.get('keyword');
  }
  get secondLife() {
    return this.secondLifeForm.get('secondLife');
  }

  submit(str: string): void {
    const form = str === 'keyword' ? this.keywordForm : this.secondLifeForm;
    const errors = this.addService.checkForErrorForm(form);
    if (errors === 0) {
      this.showError[str] = false;
      this.addKeyword(str);
    } else {
      this.showError[str] = true;
    }
  }

  addKeyword(str: string): void {
    if (str === 'keyword') {
      this.keywordsList.push(this.keyword.value);
      this.keywordForm.reset();
      this.keywordRef.nativeElement.focus();
    } else {
      this.secondLifeList.push(this.secondLife.value);
      this.secondLifeForm.reset();
      this.secondLifeRef.nativeElement.focus();
    }
  }

  remove(str: string, keyword): void {
    if (str === 'keyword') {
      this.keywordsList = this.keywordsList.filter(el => el !== keyword);
    } else {
      this.secondLifeList = this.secondLifeList.filter(el => el !== keyword);
    }
  }

  getFormErrors(input: string): boolean {
    return this.addService.getFormErrors(input);
  }

  hideError(input: string): void {
    if (input === 'keyword' && this.keyword.value) {
      this.showError.keyword = false;
    } else if (input === 'secondLife' && this.secondLife.value) {
      this.showError.secondLife = false;
    }
  }
}
