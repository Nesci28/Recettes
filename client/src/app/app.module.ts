import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { AddComponent } from './add/add.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './shared/list/list.component';
import { MealComponent } from './meal/meal.component';
import { AddHeaderComponent } from './add/add-header/add-header.component';
import {
  AddImgComponent,
  NgbdCropperModal,
} from './add/add-img/add-img.component';
import { AddIngredientsComponent } from './add/add-ingredients/add-ingredients.component';
import { AddInstructionsComponent } from './add/add-instructions/add-instructions.component';
import { AddKeywordsComponent } from './add/add-keywords/add-keywords.component';
import { HttpClientModule } from '@angular/common/http';
import { SortablejsModule } from 'ngx-sortablejs';
import { BookComponent } from './book/book.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    AddComponent,
    BaseComponent,
    MealComponent,
    AddHeaderComponent,
    AddImgComponent,
    NgbdCropperModal,
    AddIngredientsComponent,
    AddInstructionsComponent,
    AddKeywordsComponent,
    BookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularCropperjsModule,
    HttpClientModule,
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  entryComponents: [NgbdCropperModal],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
