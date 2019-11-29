import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Meal } from 'src/app/models/repas.model';

@Component({
  selector: 'app-meal-footer',
  templateUrl: './meal-footer.component.html',
  styleUrls: ['./meal-footer.component.scss'],
})
export class MealFooterComponent implements OnInit {
  @Input() meal: Meal;

  @Output() deleteModalEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() modificationModalEvent: EventEmitter<void> = new EventEmitter<
    void
  >();

  constructor() {}

  ngOnInit() {}

  // Modal Event
  modalDelete() {
    this.deleteModalEvent.emit();
  }

  changeToModification() {
    this.modificationModalEvent.emit();
  }
}
