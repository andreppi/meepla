'use client';

import { useState, useEffect } from 'react';

// Preferências em português de Portugal
const GOALS = [
  { value: '', label: 'Selecionar objetivo' },
  { value: 'lose', label: 'Perder peso' },
  { value: 'maintain', label: 'Manter peso' },
  { value: 'gain', label: 'Ganhar peso' },
];

const DIET_TYPES = [
  { value: '', label: 'Selecionar tipo de dieta' },
  { value: 'omnivore', label: 'Omnívora' },
  { value: 'vegetarian', label: 'Vegetariana' },
  { value: 'vegan', label: 'Vegana' },
  { value: 'pescatarian', label: 'Pescetariana' },
];

const DIAS_SEMANA = [
  'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
];

const MEAL_TYPES = [
  { key: 'breakfast', label: 'PA' },
  { key: 'snack1', label: 'LM' },
  { key: 'lunch', label: 'Almoço' },
  { key: 'snack2', label: 'LT' },
  { key: 'dinner', label: 'Jantar' }
];

const MEALS = [
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

const STORAGE_KEY = 'meepla-user-preferences';
const PLAN_KEY = 'meepla-weekly-plan';

// Mock ingredients and recipes for each meal
const MEAL_DETAILS: Record<string, { ingredientes: string[]; receita: string }> = {
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

function getDietTags(diet: string) {
  switch (diet) {
    case 'omnivore':
      return ['omnivore', 'vegetarian', 'vegan', 'pescatarian'];
    case 'vegetarian':
      return ['vegetarian', 'vegan'];
    case 'vegan':
      return ['vegan'];
    case 'pescatarian':
      return ['pescatarian', 'vegetarian', 'vegan'];
    default:
      return [];
  }
}

function getRandomMeal(meals: any[], type: string, used: Set<string>) {
  const filtered = meals.filter(m => m.type === type && !used.has(m.name));
  if (filtered.length === 0) return null;
  const idx = Math.floor(Math.random() * filtered.length);
  used.add(filtered[idx].name);
  return filtered[idx].name;
}

function getFreeMealSlot(plan: string[][]): [number, number] | null {
  // Only allow lunch (2) or dinner (4) as free meal
  const mealIndexes = [2, 4]; // lunch, dinner
  const totalCols = DIAS_SEMANA.length;
  const slots: [number, number][] = [];
  for (let row of mealIndexes) {
    for (let col = 0; col < totalCols; col++) {
      slots.push([col, row]);
    }
  }
  if (slots.length === 0) return null;
  const idx = Math.floor(Math.random() * slots.length);
  return slots[idx];
}

export default function Home() {
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState('');
  const [errors, setErrors] = useState<{ goal?: string; diet?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [plan, setPlan] = useState<string[][]>([]);
  const [freeSlot, setFreeSlot] = useState<[number, number] | null>(null);

  // Dialog state
  const [dialog, setDialog] = useState<{ open: boolean; meal: string }>({ open: false, meal: '' });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const prefs = JSON.parse(stored);
      setGoal(prefs.goal || '');
      setDiet(prefs.diet || '');
      if (prefs.goal && prefs.diet) setSubmitted(true);
    }
    const storedPlan = localStorage.getItem(PLAN_KEY);
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    }
    const storedFreeSlot = localStorage.getItem('meepla-free-slot');
    if (storedFreeSlot) {
      setFreeSlot(JSON.parse(storedFreeSlot));
    }
  }, []);

  useEffect(() => {
    if (submitted && goal && diet) {
      const tags = getDietTags(diet);
      const filteredMeals = MEALS.filter(m =>
        m.tags.some((tag: string) => tags.includes(tag))
      );
      const week: string[][] = [];
      for (let day = 0; day < 7; day++) {
        const used = new Set<string>();
        const dayMeals: string[] = [];
        for (const mealType of MEAL_TYPES) {
          const type = mealType.key.startsWith('snack') ? 'snack' : mealType.key;
          const meal = getRandomMeal(filteredMeals, type, used) || 'Sem sugestão';
          dayMeals.push(meal);
        }
        week.push(dayMeals);
      }
      // Pick a free meal slot
      const slot = getFreeMealSlot(week);
      if (slot) {
        week[slot[0]][slot[1]] = '🍽️ Refeição livre';
        setFreeSlot(slot);
        localStorage.setItem('meepla-free-slot', JSON.stringify(slot));
      }
      setPlan(week);
      localStorage.setItem(PLAN_KEY, JSON.stringify(week));
    }
  }, [submitted, goal, diet]);

  const regeneratePlan = () => {
    if (!goal || !diet) return;
    const tags = getDietTags(diet);
    const filteredMeals = MEALS.filter(m =>
      m.tags.some((tag: string) => tags.includes(tag))
    );
    const week: string[][] = [];
    for (let day = 0; day < 7; day++) {
      const used = new Set<string>();
      const dayMeals: string[] = [];
      for (const mealType of MEAL_TYPES) {
        const type = mealType.key.startsWith('snack') ? 'snack' : mealType.key;
        const meal = getRandomMeal(filteredMeals, type, used) || 'Sem sugestão';
        dayMeals.push(meal);
      }
      week.push(dayMeals);
    }
    // Pick a new free meal slot
    const slot = getFreeMealSlot(week);
    if (slot) {
      week[slot[0]][slot[1]] = '🍽️ Refeição livre';
      setFreeSlot(slot);
      localStorage.setItem('meepla-free-slot', JSON.stringify(slot));
    }
    setPlan(week);
    localStorage.setItem(PLAN_KEY, JSON.stringify(week));
  };

  const regenerateMeal = (dayIdx: number, mealIdx: number) => {
    if (!goal || !diet) return;
    // Don't allow regenerating the free meal
    if (freeSlot && freeSlot[0] === dayIdx && freeSlot[1] === mealIdx) return;
    const tags = getDietTags(diet);
    const filteredMeals = MEALS.filter(m =>
      m.tags.some((tag: string) => tags.includes(tag))
    );
    const used = new Set(plan[dayIdx].filter((_, i) => i !== mealIdx));
    const mealType = MEAL_TYPES[mealIdx].key.startsWith('snack') ? 'snack' : MEAL_TYPES[mealIdx].key;
    let newMeal = getRandomMeal(filteredMeals, mealType, used) || 'Sem sugestão';
    if (newMeal === plan[dayIdx][mealIdx] && filteredMeals.length > 1) {
      newMeal = getRandomMeal(filteredMeals, mealType, used) || newMeal;
    }
    const newPlan = plan.map((meals, d) =>
      d === dayIdx ? meals.map((m, i) => (i === mealIdx ? newMeal : m)) : meals
    );
    setPlan(newPlan);
    localStorage.setItem(PLAN_KEY, JSON.stringify(newPlan));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!goal) newErrors.goal = 'Por favor selecione um objetivo.';
    if (!diet) newErrors.diet = 'Por favor selecione um tipo de dieta.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal, diet }));
    }
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#181c23] text-[#e0e3e8] flex flex-col items-center justify-center p-0 sm:p-4 transition-colors">
      <div className="w-full max-w-7xl flex flex-col flex-1 h-screen sm:h-auto sm:rounded-lg shadow-lg bg-[#232733] p-0 sm:p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 mt-6 sm:mt-0 text-center text-[#e0e3e8]">Bem-vindo!</h1>
        {submitted ? (
          <div className="font-semibold space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-[#a3e635]">Preferências atuais:</div>
                <div>
                  <span className="font-medium">Objetivo:</span> {GOALS.find(g => g.value === goal)?.label}
                </div>
                <div>
                  <span className="font-medium">Dieta:</span> {DIET_TYPES.find(d => d.value === diet)?.label}
                </div>
              </div>
              <button
                className="bg-[#31364a] text-[#e0e3e8] py-2 px-4 rounded hover:bg-[#3b4252] transition"
                onClick={handleEdit}
                type="button"
              >
                Editar Preferências
              </button>
            </div>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-[#e0e3e8]">O Seu Plano Semanal de Refeições</h2>
                <button
                  className="bg-[#a3e635] text-[#232733] px-3 py-1 rounded hover:bg-[#b7f072] text-sm font-semibold transition"
                  onClick={regeneratePlan}
                  type="button"
                  title="Gerar novo plano semanal"
                >
                  Gerar novo plano
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-[#31364a] text-[#e0e3e8] text-sm bg-[#232733] table-fixed">
                  <thead>
                    <tr>
                      <th className="border border-[#31364a] px-2 py-1 bg-[#232733] w-[90px]">Refeição</th>
                      {DIAS_SEMANA.map((dia, i) => (
                        <th key={i} className="border border-[#31364a] px-2 py-1 bg-[#232733] w-[120px]">{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MEAL_TYPES.map((mealType, mealIdx) => (
                      <tr key={mealType.key} className={mealIdx % 2 === 0 ? 'bg-[#232733]' : 'bg-[#232b3b]'}>
                        <td className="border border-[#31364a] px-2 py-1 font-bold w-[90px]">{mealType.label}</td>
                        {plan.map((dayMeals, dayIdx) => {
                          const isFree = freeSlot && freeSlot[0] === dayIdx && freeSlot[1] === mealIdx;
                          return (
                            <td
                              key={dayIdx}
                              className={
                                `border border-[#31364a] px-2 py-1 group cursor-pointer relative transition w-[120px] max-w-[120px] align-top
                                ${isFree ? 'bg-gradient-to-br from-[#232733] to-[#a3e635]/30 text-[#a3e635] font-bold ring-[#a3e635] ring-inset shadow-lg' : ''}
                                `
                              }
                              style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                              onClick={() => setDialog({ open: true, meal: dayMeals[mealIdx] })}
                              title={isFree ? 'Refeição livre' : 'Clique para ver detalhes'}
                            >
                              <div className="flex items-center gap-1">
                                <span
                                  className={`flex-1 truncate`}
                                  style={{
                                    minWidth: 0,
                                    display: 'block',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'normal',
                                    maxWidth: '100%',
                                  }}
                                >
                                  {dayMeals[mealIdx] || <span className="text-gray-500 italic">—</span>}
                                </span>
                                {!isFree && (
                                  <button
                                    type="button"
                                    className="text-[#a3e635] hover:text-[#b7f072] text-xs px-1"
                                    title="Trocar sugestão"
                                    onClick={e => {
                                      e.stopPropagation();
                                      regenerateMeal(dayIdx, mealIdx);
                                    }}
                                  >
                                    🔄
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-xs text-gray-400 mt-2">
                  Clique numa célula para ver ingredientes e receita. <span className="text-[#a3e635] font-bold">Refeição livre</span> é destacada.
                </div>
              </div>
            </div>
            {/* Dialog */}
            {dialog.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-[#232733] rounded-lg shadow-lg p-6 max-w-xs w-full relative">
                  <button
                    className="absolute top-2 right-2 text-[#a3e635] hover:text-[#b7f072] text-xl"
                    onClick={() => setDialog({ open: false, meal: '' })}
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-bold mb-2 text-[#a3e635]">{dialog.meal}</h3>
                  <div className="mb-2">
                    <span className="font-semibold">Ingredientes:</span>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {(MEAL_DETAILS[dialog.meal]?.ingredientes || ['Sem informação.']).map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Receita:</span>
                    <p className="text-sm mt-1 whitespace-pre-line">{MEAL_DETAILS[dialog.meal]?.receita || 'Sem informação.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full mt-8">
            <div>
              <label className="block mb-1 font-medium text-[#e0e3e8]" htmlFor="goal">Objetivo</label>
              <select
                id="goal"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full border border-[#31364a] bg-[#232733] text-[#e0e3e8] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a3e635] transition"
              >
                {GOALS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.goal && <p className="text-[#f87171] text-sm mt-1">{errors.goal}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#e0e3e8]" htmlFor="diet">Tipo de dieta</label>
              <select
                id="diet"
                value={diet}
                onChange={e => setDiet(e.target.value)}
                className="w-full border border-[#31364a] bg-[#232733] text-[#e0e3e8] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a3e635] transition"
              >
                {DIET_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.diet && <p className="text-[#f87171] text-sm mt-1">{errors.diet}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#a3e635] text-[#232733] py-2 rounded hover:bg-[#b7f072] font-semibold transition"
            >
              Guardar
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
