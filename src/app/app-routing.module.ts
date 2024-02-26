import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { Header1Component } from './header1/header1.component';

const appRoutes: Routes = [
  // { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // {
  //   path: 'recipes',
  //   component: RecipesComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: '', component: RecipeStartComponent },
  //     { path: 'new', component: RecipeEditComponent },
  //     {
  //       path: ':id',
  //       component: RecipeDetailComponent,
        
  //     },
  //     {
  //       path: ':id/edit',
  //       component: RecipeEditComponent,
        
  //     }
  //   ]
  // },
  // { path: 'shopping-list', component: ShoppingListComponent },
  { path: '', component: AuthComponent },
  {path:"courses",
component:Header1Component},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
