export type RecipeStackParamList = {
  '(tabs)/recipes': {
    mode?: 'select';
    date?: string;
    meal_type?: 'breakfast' | 'lunch' | 'dinner';
  };
  'recipes/[id]': {
    id: string;
  };
  'recipes/create': {
    source_url?: string;
  };
};

export type RootStackParamList = {
  '(tabs)': undefined;
  'modal': undefined;
  'login': undefined;
} & RecipeStackParamList;
