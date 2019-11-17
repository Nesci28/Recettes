import { Component, OnInit, ViewChild } from '@angular/core';

import { ListComponent } from '../shared/list/list.component.js';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  @ViewChild('listComponent', { static: true }) listComponent: ListComponent;
  noneSelectedError: boolean = false;

  constructor() {}

  ngOnInit() {}

  generatePDF(): void {
    // GrouBy Order (entree, principal, dessert)
    console.log('Book :', this.listComponent.book);
    if (this.listComponent.book.length === 0) {
      this.noneSelectedError = true;
    } else {
      this.noneSelectedError = false;
    }
  }

  dismissError(): void {
    this.noneSelectedError = false;
  }
}
