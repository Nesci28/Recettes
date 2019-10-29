import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"]
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
