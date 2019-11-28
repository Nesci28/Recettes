import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  template: `
    <p></p>
  `,
  styles: [],
})
export class BaseComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
