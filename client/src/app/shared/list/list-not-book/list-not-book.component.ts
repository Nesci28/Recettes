import { Component, OnInit, Input } from '@angular/core';
import { Meal } from 'src/app/models/repas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from 'src/app/meal.service';

@Component({
  selector: 'app-list-not-book',
  templateUrl: './list-not-book.component.html',
  styleUrls: ['./list-not-book.component.scss'],
})
export class ListNotBookComponent implements OnInit {
  @Input() selectedMeals: Meal[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mealService: MealService,
  ) {}

  ngOnInit() {}

  getName(name: string): string {
    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
  }

  getMeal(repas: Meal): void {
    let cont = true;
    for (const meal of this.selectedMeals) {
      if (meal.id === repas.id) {
        this.mealService.meal = meal;
        cont = false;
        break;
      }
      if (!cont) break;
    }
    if (this.route.snapshot.params.id !== 'recherche') {
      this.router.navigateByUrl(
        `/presentation/${this.route.snapshot.params.id}/${repas.id}`,
      );
    } else {
      this.router.navigateByUrl(
        `/presentation/${repas.type}/${repas.name.replace(/ /g, '_')}`,
      );
    }
  }
}
