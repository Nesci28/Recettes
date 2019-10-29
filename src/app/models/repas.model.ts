export interface Ingredients {
  name: string;
  quantity: string;
  type: string;
  disabled: boolean;
}

export interface Step {
  step: string;
  disabled: boolean;
}

export interface Meal {
  name: string;
  id: number;
  type: string;
  keywords: string[];
  ingredients: Ingredients[];
  steps: Step[];
  filtered: boolean;
}
