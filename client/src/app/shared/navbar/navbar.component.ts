import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {}

  iAmAtHome(): boolean {
    return this.router.url === '/';
  }
}
