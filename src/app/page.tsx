'use client';

import { useState, useEffect } from 'react';
import { MEALS, MEAL_DETAILS } from './meals';
import { DIAS_SEMANA, MEAL_TYPES, GOALS, DIET_TYPES } from './userPreferences';

const STORAGE_KEY = 'meepla-user-preferences';
const PLAN_KEY = 'meepla-weekly-plan';

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
  // Only allow lunch (2) or dinner (4) as free meal, but not Sunday lunch (6,2)
  const mealIndexes = [2, 4]; // lunch, dinner
  const totalCols = DIAS_SEMANA.length;
  const slots: [number, number][] = [];
  for (const row of mealIndexes) {
    for (let col = 0; col < totalCols; col++) {
      // Exclude Sunday lunch
      if (!(col === 6 && row === 2)) {
        slots.push([col, row]);
      }
    }
  }
  if (slots.length === 0) return null;
  const idx = Math.floor(Math.random() * slots.length);
  return slots[idx];
}

function generateWeeklyPlan(filteredMeals: any[]) {
  // Helper to get meals by type
  const getMealsByType = (type: string) => filteredMeals.filter(m => m.type === type);

  // 1. Dinners: all different
  const dinnerMeals = getMealsByType('dinner');
  let dinners: string[] = [];
  if (dinnerMeals.length >= 7) {
    dinners = dinnerMeals
      .sort(() => Math.random() - 0.5)
      .slice(0, 7)
      .map(m => m.name);
  } else {
    dinners = [...dinnerMeals.map(m => m.name)];
    while (dinners.length < 7) dinners.push('Sem sugestão');
  }

  // 2. Lunches: at least 2 are leftovers from previous dinner, rest random (not same as dinner)
  const lunchMeals = getMealsByType('lunch');
  const lunches: string[] = [];
  const leftoverDays = new Set<number>();
  while (leftoverDays.size < 2) {
    const day = Math.floor(Math.random() * 6) + 1; // days 1-6 (Mon-Sat), avoid Sunday
    leftoverDays.add(day);
  }
  for (let i = 0; i < 7; i++) {
    if (leftoverDays.has(i)) {
      lunches.push(dinners[i - 1] || 'Sem sugestão');
    } else {
      const options = lunchMeals.filter(m => m.name !== dinners[i]);
      if (options.length > 0) {
        lunches.push(options[Math.floor(Math.random() * options.length)].name);
      } else {
        lunches.push('Sem sugestão');
      }
    }
  }

  // 3. Snacks: can only repeat once per week (max 2x per snack)
  const snackMeals = getMealsByType('snack');
  const snackPool = [...snackMeals.map(m => m.name)];
  const snackCounts: Record<string, number> = {};
  const pickSnack = () => {
    const available = snackPool.filter(snack => (snackCounts[snack] || 0) < 2);
    if (available.length === 0) return 'Sem sugestão';
    const snack = available[Math.floor(Math.random() * available.length)];
    snackCounts[snack] = (snackCounts[snack] || 0) + 1;
    return snack;
  };

  // 4. Breakfasts: can only repeat once per week (max 2x per breakfast)
  const breakfastMeals = getMealsByType('breakfast');
  const breakfastCounts: Record<string, number> = {};
  const pickBreakfast = () => {
    const available = breakfastMeals.filter(m => (breakfastCounts[m.name] || 0) < 2);
    if (available.length === 0) return 'Sem sugestão';
    const breakfast = available[Math.floor(Math.random() * available.length)].name;
    breakfastCounts[breakfast] = (breakfastCounts[breakfast] || 0) + 1;
    return breakfast;
  };

  // 5. Ceia: random snack
  const pickCeia = pickSnack;

  // Build week plan
  const week: string[][] = [];
  for (let day = 0; day < 7; day++) {
    const used = new Set<string>();
    const dayMeals: string[] = [];
    // Pequeno-almoço
    const breakfast = pickBreakfast();
    dayMeals.push(breakfast);
    used.add(breakfast);

    // Lanche da manhã
    const snack1 = pickSnack();
    dayMeals.push(snack1);
    used.add(snack1);

    // Almoço
    let lunch = lunches[day];
    // Make Sunday lunch always a free meal
    if (day === 6) {
      lunch = '🍽️ Refeição livre';
    }
    dayMeals.push(lunch);
    used.add(lunch);

    // Lanche da tarde
    const snack2 = pickSnack();
    dayMeals.push(snack2);
    used.add(snack2);

    // Jantar
    const dinner = dinners[day];
    dayMeals.push(dinner);
    used.add(dinner);

    // Ceia
    const snack3 = pickCeia();
    dayMeals.push(snack3);

    week.push(dayMeals);
  }
  return week;
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
  const [loading, setLoading] = useState(true);

  // For collapsible days
  const [openDays, setOpenDays] = useState<number[]>([]);

  /* // Open today's section by default
  useEffect(() => {
    if (submitted && openDays.length === 0) {
      const today = new Date().getDay(); // 0 (Sunday) - 6 (Saturday)
      // Our DIAS_SEMANA: 0=Segunda, ..., 6=Domingo
      // JS: 0=Sunday, 1=Monday, ..., 6=Saturday
      // Map JS Sunday (0) to 6, Monday (1) to 0, ..., Saturday (6) to 5
      const appDay = today === 0 ? 6 : today - 1;
      setOpenDays([appDay]);
    }
  }, [submitted, openDays.length]); */

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
    setLoading(false);
  }, []);

  useEffect(() => {
    if (submitted && goal && diet) {
      const tags = getDietTags(diet);
      const filteredMeals = MEALS.filter(m =>
        m.tags.some((tag: string) => tags.includes(tag))
      );
      // Generate plan with new rules
      const week = generateWeeklyPlan(filteredMeals);

      // Pick a free meal slot (lunch or dinner)
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
    const week = generateWeeklyPlan(filteredMeals);

    // Pick a new free meal slot (lunch or dinner)
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

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem('meepla-free-slot');
    setGoal('');
    setDiet('');
    setPlan([]);
    setFreeSlot(null);
    setSubmitted(false);
    setErrors({});
  };

  const toggleDay = (idx: number) => {
    setOpenDays(open =>
      open.includes(idx) ? open.filter(i => i !== idx) : [...open, idx]
    );
  };

  if (loading) {
    return null; // or a spinner if you prefer
  }

  return (
    <main className="min-h-screen w-full bg-[#181c23] text-[#e0e3e8] flex flex-col items-center justify-center p-0 sm:p-4 transition-colors">
      <div className="w-full max-w-2xl flex flex-col flex-1 h-screen sm:h-auto sm:rounded-lg shadow-lg bg-[#232733] p-0 sm:p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 mt-6 sm:mt-0 text-center text-[#e0e3e8]">Bem-vindo!</h1>
        {submitted ? (
          <div className="font-semibold space-y-4">
            <div className="flex items-center justify-end mb-2 gap-2">
              <button
                className="bg-[#f87171] text-[#232733] px-3 py-1 rounded hover:bg-[#fca5a5] text-sm font-semibold transition"
                onClick={handleReset}
                type="button"
                title="Repor Preferências"
              >
                Repor Preferências
              </button>
              <button
                className="bg-[#a3e635] text-[#232733] px-3 py-1 rounded hover:bg-[#b7f072] text-sm font-semibold transition"
                onClick={regeneratePlan}
                type="button"
                title="Gerar novo plano semanal"
              >
                Gerar novo plano
              </button>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#e0e3e8] mb-4">O Seu Plano Semanal</h2>
              <div className="flex flex-col gap-4">
                {plan.map((meals, dayIdx) => (
                  <div key={dayIdx} className="relative">
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition
                        ${openDays.includes(dayIdx)
                          ? 'bg-[#a3e635]/20 text-[#a3e635]'
                          : 'bg-[#232b3b] text-[#e0e3e8] hover:bg-[#31364a]'}
                        font-bold text-lg`}
                      onClick={() => toggleDay(dayIdx)}
                      aria-expanded={openDays.includes(dayIdx)}
                      aria-controls={`day-panel-${dayIdx}`}
                    >
                      <span>
                        {DIAS_SEMANA[dayIdx]}
                      </span>
                      <span className="ml-2 text-xl">
                        {openDays.includes(dayIdx) ? '▲' : '▼'}
                      </span>
                    </button>
                    {openDays.includes(dayIdx) && (
                      <div
                        id={`day-panel-${dayIdx}`}
                        className="bg-[#232733] border-l-4 border-[#a3e635] rounded-b-lg px-4 py-3 mt-0"
                      >
                        <ol className="space-y-3">
                          {MEAL_TYPES.map((mealType, mealIdx) => {
                            const isFree =
                              (freeSlot && freeSlot[0] === dayIdx && freeSlot[1] === mealIdx) ||
                              (mealIdx === 2 && dayIdx === 6 && meals[mealIdx] === '🍽️ Refeição livre');
                            return (
                              <li
                                key={mealType.key}
                                className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded transition
                                  ${isFree
                                    ? 'bg-gradient-to-br from-[#232733] to-[#a3e635]/30 text-[#a3e635] font-bold ring-2 ring-[#a3e635] ring-inset shadow-lg'
                                    : mealIdx % 2 === 0
                                    ? 'bg-[#232733]'
                                    : 'bg-[#232b3b]'
                                  }`}
                              >
                                <div className="flex-1">
                                  <span className="font-semibold">{mealType.label}:</span>{' '}
                                  <span
                                    className="cursor-pointer underline decoration-dotted"
                                    title="Clique para ver detalhes"
                                    onClick={() => setDialog({ open: true, meal: meals[mealIdx] })}
                                  >
                                    {meals[mealIdx] || <span className="text-gray-500 italic">—</span>}
                                  </span>
                                </div>
                                {!isFree && (
                                  <button
                                    type="button"
                                    className="text-[#a3e635] hover:text-[#b7f072] text-xs px-2 py-1 rounded transition"
                                    title="Trocar sugestão"
                                    onClick={() => regenerateMeal(dayIdx, mealIdx)}
                                  >
                                    🔄 Trocar
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    )}
        
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-4">
                Clique numa refeição para ver ingredientes e receita. <span className="text-[#a3e635] font-bold">Refeição livre</span> é destacada.
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
