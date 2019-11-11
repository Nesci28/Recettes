import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddService } from '../add.service';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/meal.service';

@Component({
  selector: 'app-add-keywords',
  templateUrl: './add-keywords.component.html',
  styleUrls: ['./add-keywords.component.scss'],
})
export class AddKeywordsComponent implements OnInit {
  @ViewChild('keyword', { static: false }) keywordRef: ElementRef;

  // Forms
  keywordForm = new FormGroup({
    keyword: new FormControl('', Validators.required),
  });

  keywordsList: string[] = [];

  constructor(
    private addService: AddService,
    private router: ActivatedRoute,
    private mealService: MealService,
  ) {}

  ngOnInit() {
    if (this.router.snapshot.url[0].path === 'modification') {
      this.keywordsList = this.mealService.meal.keywords;
    }
  }

  get keyword() {
    return this.keywordForm.get('keyword');
  }

  submitKeyword(): void {
    const errors = this.addService.checkForErrorForm(this.keywordForm);
    if (errors === 0) {
      this.addKeyword();
    }
  }

  addKeyword(): void {
    this.keywordsList.push(this.keyword.value);
    this.keywordForm.reset();
    this.keywordRef.nativeElement.focus();
  }

  removeKeyword(keyword): void {
    this.keywordsList = this.keywordsList.filter(el => el !== keyword);
  }
}
