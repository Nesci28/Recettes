import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddComponent } from './add/add.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './shared/list/list.component';
import { MealComponent } from './meal/meal.component';
import { BookComponent } from './book/book.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'liste/:id', component: ListComponent },
  { path: 'ajouter', component: AddComponent },
  { path: 'presentation/:type/:id', component: MealComponent },
  { path: 'modification/:type/:id', component: AddComponent },
  { path: ':id/:query', component: ListComponent },
  { path: 'livre', component: BookComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
