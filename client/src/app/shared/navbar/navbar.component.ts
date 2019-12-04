import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed: boolean = true;
  query: string;

  constructor(private router: Router) {}

  ngOnInit() {}

  iAmAtHome(): boolean {
    return this.router.url === '/';
  }

  search(): void {
    this.router.navigateByUrl(`/recherche/${this.query}`);
  }

  notIphone(): boolean {
    return navigator.platform !== 'iPhone';
  }
}
