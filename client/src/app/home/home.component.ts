import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @HostListener('window:resize', [])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: number;

  constructor() {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }
}
