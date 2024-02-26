import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap,catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  // storeRecipes() {
  //   const recipes = this.recipeService.getRecipes();
  //   this.http
  //     .put(
  //       'https://ng-course-recipe-book2-17d85-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
  //       recipes
  //     )
  //     .subscribe(response => {
  //       console.log(response);
  //     });
  // }

  // ***********************************************

 

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('http://localhost:5000/courses', recipes)
      .pipe(
        catchError(error => {
          console.error('Error storing recipes:', error);
          return throwError('Something went wrong while storing recipes.');
        })
      )
      .subscribe(response => {
        console.log('Recipes stored successfully:', response);
      });
  }

  // fetchRecipes() {
  //   return this.http
  //     .get<Recipe[]>(
  //       'https://ng-course-recipe-book2-17d85-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
  //     )
  //     .pipe(
  //       map(recipes => {
  //         return recipes.map(recipe => {
  //           return {
  //             ...recipe,
  //             ingredients: recipe.ingredients ? recipe.ingredients : []
  //           };
  //         });
  //       }),
  //       tap(recipes => {
  //         this.recipeService.setRecipes(recipes);
  //       })
  //     );
  // }
  
  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'http://localhost:5000/courses'
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
