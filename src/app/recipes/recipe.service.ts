import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();


  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService,
    private http: HttpClient
    ) {}

    
    
  

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.http.post<Recipe>('http://localhost:5000/courses', recipe)
      .subscribe((newRecipe: Recipe) => {
        this.recipes.push(newRecipe);
        this.recipesChanged.next(this.recipes.slice());
      });
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.http.put(`http://localhost:5000/courses/${index}`, newRecipe)
      .subscribe(() => {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      });
  }


  deleteRecipe(index: number) {
    this.http.delete(`http://localhost:5000/courses/${index}`)
      .subscribe(() => {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
      });
  }
}
