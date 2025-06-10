export const MEALS = [
  { name: 'Papas de Aveia com Frutos Vermelhos', type: 'breakfast', tags: ['vegetarian', 'high fiber'] },
  { name: 'Iogurte Grego com Granola', type: 'breakfast', tags: ['vegetarian', 'high protein'] },
  { name: 'Ovos Mexidos com Torrada', type: 'breakfast', tags: ['omnivore', 'high protein'] },
  { name: 'Taça de Smoothie Vegan', type: 'breakfast', tags: ['vegan'] },
  { name: 'Tosta de Abacate', type: 'breakfast', tags: ['vegetarian'] },
  // Snacks
  { name: 'Maçã com Manteiga de Amendoim', type: 'snack', tags: ['vegetarian', 'vegan'] },
  { name: 'Barra de Proteína', type: 'snack', tags: ['omnivore', 'vegetarian', 'high protein'] },
  { name: 'Palitos de Cenoura com Húmus', type: 'snack', tags: ['vegan', 'vegetarian'] },
  { name: 'Ovo Cozido', type: 'snack', tags: ['omnivore', 'high protein'] },
  { name: 'Mix de Frutos Secos', type: 'snack', tags: ['vegetarian', 'vegan'] },
  // Lunches
  { name: 'Salada de Frango Grelhado', type: 'lunch', tags: ['omnivore', 'high protein'] },
  { name: 'Taça de Quinoa e Feijão Preto', type: 'lunch', tags: ['vegan', 'vegetarian', 'high fiber'] },
  { name: 'Sandes de Peru', type: 'lunch', tags: ['omnivore'] },
  { name: 'Sopa de Lentilhas', type: 'lunch', tags: ['vegan', 'vegetarian', 'high fiber'] },
  { name: 'Salada Caprese', type: 'lunch', tags: ['vegetarian'] },
  // Dinners
  { name: 'Salmão com Legumes', type: 'dinner', tags: ['pescatarian', 'omnivore', 'high protein'] },
  { name: 'Tofu Salteado com Arroz', type: 'dinner', tags: ['vegan', 'vegetarian'] },
  { name: 'Salteado de Vaca', type: 'dinner', tags: ['omnivore', 'high protein'] },
  { name: 'Caril de Legumes', type: 'dinner', tags: ['vegan', 'vegetarian'] },
  { name: 'Beringela à Parmegiana', type: 'dinner', tags: ['vegetarian'] },
  // More snacks
  { name: 'Queijo Fresco com Ananás', type: 'snack', tags: ['vegetarian', 'high protein'] },
  { name: 'Tortas de Arroz com Manteiga de Amêndoa', type: 'snack', tags: ['vegan', 'vegetarian'] },
  { name: 'Edamame', type: 'snack', tags: ['vegan', 'vegetarian', 'high protein'] },
  { name: 'Iogurte com Granola', type: 'snack', tags: ['vegetarian'] },
  { name: 'Salada de Fruta', type: 'snack', tags: ['vegan', 'vegetarian'] },
  // More lunches/dinners
  { name: 'Salada de Grão-de-bico', type: 'lunch', tags: ['vegan', 'vegetarian', 'high fiber'] },
  { name: 'Tacos de Camarão', type: 'lunch', tags: ['pescatarian', 'omnivore'] },
  { name: 'Salteado de Frango', type: 'dinner', tags: ['omnivore', 'high protein'] },
  { name: 'Pimentos Recheados', type: 'dinner', tags: ['vegetarian'] },
  { name: 'Chili Vegan', type: 'dinner', tags: ['vegan', 'vegetarian', 'high fiber'] },
];

// Mock ingredients and recipes for each meal
export const MEAL_DETAILS: Record<string, { ingredientes: string[]; receita: string }> = {
  'Papás de Aveia com Frutos Vermelhos': {
    ingredientes: ['Aveia', 'Leite', 'Frutos vermelhos', 'Mel'],
    receita: 'Cozinhe a aveia com leite, adicione frutos vermelhos e mel por cima.'
  },
  'Iogurte Grego com Granola': {
    ingredientes: ['Iogurte grego', 'Granola', 'Mel', 'Fruta a gosto'],
    receita: 'Coloque o iogurte numa taça, adicione granola, fruta e mel.'
  },
  'Ovos Mexidos com Torrada': {
    ingredientes: ['Ovos', 'Pão', 'Sal', 'Pimenta', 'Azeite'],
    receita: 'Bata os ovos, tempere e cozinhe em azeite. Sirva com pão torrado.'
  },
  'Taça de Smoothie Vegan': {
    ingredientes: ['Banana', 'Leite vegetal', 'Frutos vermelhos', 'Sementes de chia'],
    receita: 'Bata tudo no liquidificador e sirva numa taça com sementes por cima.'
  },
  'Tosta de Abacate': {
    ingredientes: ['Pão', 'Abacate', 'Limão', 'Sal', 'Pimenta'],
    receita: 'Esmague o abacate, tempere e coloque sobre o pão torrado.'
  },
  'Maçã com Manteiga de Amendoim': {
    ingredientes: ['Maçã', 'Manteiga de amendoim'],
    receita: 'Corte a maçã em fatias e barre com manteiga de amendoim.'
  },
  'Barra de Proteína': {
    ingredientes: ['Barra de proteína (industrializada ou caseira)'],
    receita: 'Consumir diretamente.'
  },
  'Palitos de Cenoura com Húmus': {
    ingredientes: ['Cenoura', 'Húmus'],
    receita: 'Corte a cenoura em palitos e mergulhe no húmus.'
  },
  'Ovo Cozido': {
    ingredientes: ['Ovo', 'Sal'],
    receita: 'Coza o ovo em água durante 8-10 minutos.'
  },
  'Mix de Frutos Secos': {
    ingredientes: ['Frutos secos variados'],
    receita: 'Misture os frutos secos numa taça.'
  },
  'Salada de Frango Grelhado': {
    ingredientes: ['Frango grelhado', 'Alface', 'Tomate', 'Azeite', 'Sal'],
    receita: 'Misture o frango cortado com os vegetais e tempere a gosto.'
  },
  'Taça de Quinoa e Feijão Preto': {
    ingredientes: ['Quinoa', 'Feijão preto', 'Milho', 'Pimentos', 'Coentros'],
    receita: 'Cozinhe a quinoa, misture com os restantes ingredientes e sirva.'
  },
  'Sandes de Peru': {
    ingredientes: ['Pão', 'Peito de peru', 'Alface', 'Tomate'],
    receita: 'Monte a sandes com todos os ingredientes.'
  },
  'Sopa de Lentilhas': {
    ingredientes: ['Lentilhas', 'Cenoura', 'Cebola', 'Azeite', 'Sal'],
    receita: 'Cozinhe tudo até ficar macio e triture se desejar.'
  },
  'Salada Caprese': {
    ingredientes: ['Mozzarella', 'Tomate', 'Manjericão', 'Azeite'],
    receita: 'Monte camadas de tomate e mozzarella, tempere com azeite e manjericão.'
  },
  'Salmão com Legumes': {
    ingredientes: ['Salmão', 'Legumes variados', 'Azeite', 'Sal', 'Limão'],
    receita: 'Grelhe o salmão e os legumes, tempere com limão e azeite.'
  },
  'Tofu Salteado com Arroz': {
    ingredientes: ['Tofu', 'Arroz', 'Legumes', 'Molho de soja'],
    receita: 'Salteie o tofu e legumes, sirva com arroz cozido.'
  },
  'Salteado de Vaca': {
    ingredientes: ['Carne de vaca', 'Legumes', 'Molho de soja', 'Arroz'],
    receita: 'Salteie a carne e legumes, sirva com arroz.'
  },
  'Caril de Legumes': {
    ingredientes: ['Legumes variados', 'Leite de coco', 'Caril em pó'],
    receita: 'Cozinhe os legumes com leite de coco e caril.'
  },
  'Beringela à Parmegiana': {
    ingredientes: ['Beringela', 'Molho de tomate', 'Queijo', 'Oregãos'],
    receita: 'Monte camadas de beringela, molho e queijo, leve ao forno.'
  },
  'Queijo Fresco com Ananás': {
    ingredientes: ['Queijo fresco', 'Ananás'],
    receita: 'Corte o ananás e sirva com queijo fresco.'
  },
  'Tortas de Arroz com Manteiga de Amêndoa': {
    ingredientes: ['Tortas de arroz', 'Manteiga de amêndoa'],
    receita: 'Barre as tortas com manteiga de amêndoa.'
  },
  'Edamame': {
    ingredientes: ['Edamame', 'Sal'],
    receita: 'Coza o edamame e tempere com sal.'
  },
  'Iogurte com Granola': {
    ingredientes: ['Iogurte', 'Granola', 'Fruta a gosto'],
    receita: 'Misture tudo numa taça.'
  },
  'Salada de Fruta': {
    ingredientes: ['Fruta variada'],
    receita: 'Corte a fruta e misture numa taça.'
  },
  'Salada de Grão-de-bico': {
    ingredientes: ['Grão-de-bico', 'Tomate', 'Cebola', 'Azeite'],
    receita: 'Misture todos os ingredientes e tempere a gosto.'
  },
  'Tacos de Camarão': {
    ingredientes: ['Tortilhas', 'Camarão', 'Alface', 'Molho'],
    receita: 'Salteie o camarão, monte os tacos com os restantes ingredientes.'
  },
  'Salteado de Frango': {
    ingredientes: ['Frango', 'Legumes', 'Molho de soja', 'Arroz'],
    receita: 'Salteie o frango e legumes, sirva com arroz.'
  },
  'Pimentos Recheados': {
    ingredientes: ['Pimentos', 'Arroz', 'Carne ou legumes', 'Queijo'],
    receita: 'Recheie os pimentos e leve ao forno.'
  },
  'Chili Vegan': {
    ingredientes: ['Feijão', 'Tomate', 'Milho', 'Pimentos', 'Especiarias'],
    receita: 'Cozinhe tudo junto até engrossar.'
  },
  // fallback
  'Sem sugestão': {
    ingredientes: [],
    receita: 'Sem receita disponível.'
  },
  '🍽️ Refeição livre': {
    ingredientes: [],
    receita: 'Escolha o que mais lhe apetecer nesta refeição!'
  }
};