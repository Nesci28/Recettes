import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddComponent } from './add/add.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './shared/list/list.component';
import { MealComponent } from './meal/meal.component';
import { BookComponent } from './book/book.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { animationState: 'Home' } },
  {
    path: 'liste/:id',
    component: ListComponent,
    data: { animationState: 'One' },
  },
  { path: 'ajouter', component: AddComponent, data: { animationState: 'Two' } },
  {
    path: 'presentation/:type/:id',
    component: MealComponent,
    data: { animationState: 'Three' },
  },
  {
    path: 'modification/:type/:id',
    component: AddComponent,
    data: { animationState: 'Four' },
  },
  {
    path: ':id/:query',
    component: ListComponent,
    data: { animationState: 'Five' },
  },
  { path: 'livre', component: BookComponent, data: { animationState: 'Six' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
