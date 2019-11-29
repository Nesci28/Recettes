import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { NgxPrintModule } from 'ngx-print';
import { SortablejsModule } from 'ngx-sortablejs';

import { AddHeaderComponent } from './add/add-header/add-header.component';
import {
  AddImgComponent,
  NgbdCropperModal,
} from './add/add-img/add-img.component';
import { AddIngredientsComponent } from './add/add-ingredients/add-ingredients.component';
import { AddInstructionsComponent } from './add/add-instructions/add-instructions.component';
import { AddKeywordsComponent } from './add/add-keywords/add-keywords.component';
import { AddComponent } from './add/add.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { BookComponent } from './book/book.component';
import { HomeComponent } from './home/home.component';
import { MealComponent, NgbdDeleteModal } from './meal/meal.component';
import { BannerComponent } from './shared/banner/banner.component';
import { ListComponent } from './shared/list/list.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PrintWithImageComponent } from './meal/print-with-image/print-with-image.component';
import { PrintWithoutImageComponent } from './meal/print-without-image/print-without-image.component';

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
    NavbarComponent,
    BannerComponent,
    NgbdDeleteModal,
    PrintWithImageComponent,
    PrintWithoutImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularCropperjsModule,
    HttpClientModule,
    SortablejsModule.forRoot({ animation: 150 }),
    NgxPrintModule,
  ],
  entryComponents: [NgbdCropperModal, NgbdDeleteModal],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
