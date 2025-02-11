import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NotFoundComponent} from './not-found/not-found.component';
import {MatDateFnsModule} from "@angular/material-date-fns-adapter";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {provideHttpClient} from "@angular/common/http";
import {PoetryComponent} from "./poetry/poetry.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BrowserModule} from "@angular/platform-browser";
import {SearchComponent} from "./search/search.component";
import {ResultsComponent} from "./results/results.component";
import {AuthorFilterComponent} from "./author-filter/author-filter.component";
import {TitleFilterComponent} from "./title-filter/title-filter.component";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NotFoundComponent,
    PoetryComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDateFnsModule,
    MatSnackBarModule,
    SearchComponent,
    ResultsComponent,
    AuthorFilterComponent,
    TitleFilterComponent
  ],
  exports: [
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
    provideHttpClient()
  ]
})
export class AppModule {
}
