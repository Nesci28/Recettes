export interface Ingredients {
  ingredient: string;
  quantity: string;
  ingType: string;
  unit: string;
  disabled?: boolean;
}

export interface Instruction {
  instruction: string;
  disabled: boolean;
  author: string;
  selected: boolean;
  title: string;
}

export interface Meal {
  name: string;
  id: string;
  type: string;
  description: string;
  portion: number;
  keywords: string[];
  secondLife: string[];
  ingredients: Ingredients[];
  instructions: Instruction[];
  filtered?: boolean;
  image?: string;
  selected?: boolean;
  comments?: string[];
}
