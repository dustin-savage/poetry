import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./not-found/not-found.component";
import {NavComponent} from "./nav/nav.component";
import {PoetryComponent} from "./poetry/poetry.component";

const routes: Routes = [
  { path: 'app', component: NavComponent, children: [
      { path: 'poetry', component: PoetryComponent },
      { path: '',   redirectTo: 'poetry', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
