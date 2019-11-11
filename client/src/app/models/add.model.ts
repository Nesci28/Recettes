export interface IngredientList {
  ingredient: string;
  ingType: string;
  quantity: string;
  unit: string;
}

interface Name {
  name: boolean;
  type: boolean;
}

interface Ingredient {
  ingredient: boolean;
  type: boolean;
  quantity: boolean;
  unit: boolean;
}

export interface ErrorList {
  nameForm: Name;
  ingredientForm: Ingredient;
  stepForm: boolean;
}
