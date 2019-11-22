import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  images = [
    '../../assets/Food-banner.jpg',
    '../../assets/Food-banner-2.jpg',
    '../../assets/blog_banner_61EFCFB17F72B60.jpg',
    '../../assets/hero-banner-food-panda.jpg',
    '../../assets/69292680-easter-cooking-flour-butter-colorful-eggs-and-kitchen-utensils-for-cooking-banner.jpg',
    '../../assets/82244490-italian-food-background-pasta-and-meat-long-banner-format-.jpg',
    '../../assets/90443223-vegetarian-asian-cuisine-ingredients-for-stir-fry-with-chopped-vegetables-coco-milk-spices-chopstick.jpg',
    '../../assets/fresh-food-banner.jpg',
  ];

  paused = false;

  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor() {}

  ngOnInit() {}
}
