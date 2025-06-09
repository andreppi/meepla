'use client';

import { useState, useEffect } from 'react';

const GOALS = [
  { value: '', label: 'Select goal' },
  { value: 'lose', label: 'Lose weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain', label: 'Gain' },
];

const DIET_TYPES = [
  { value: '', label: 'Select diet type' },
  { value: 'omnivore', label: 'Omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  // Add more as needed
];

const STORAGE_KEY = 'meepla-user-preferences';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState('');
  const [errors, setErrors] = useState<{ goal?: string; diet?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const prefs = JSON.parse(stored);
      setGoal(prefs.goal || '');
      setDiet(prefs.diet || '');
      if (prefs.goal && prefs.diet) setSubmitted(true);
    }
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!goal) newErrors.goal = 'Please select a goal.';
    if (!diet) newErrors.diet = 'Please select a diet type.';
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome!</h1>
        {submitted ? (
          <div className="text-green-600 font-semibold space-y-4">
            <div>
              <div>Preferences saved!</div>
              <div>
                <span className="font-medium">Goal:</span> {GOALS.find(g => g.value === goal)?.label}
              </div>
              <div>
                <span className="font-medium">Diet:</span> {DIET_TYPES.find(d => d.value === diet)?.label}
              </div>
            </div>
            <button
              className="mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              onClick={handleEdit}
              type="button"
            >
              Edit Preferences
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium" htmlFor="goal">Goal</label>
              <select
                id="goal"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {GOALS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="diet">Diet type</label>
              <select
                id="diet"
                value={diet}
                onChange={e => setDiet(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {DIET_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.diet && <p className="text-red-500 text-sm mt-1">{errors.diet}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
