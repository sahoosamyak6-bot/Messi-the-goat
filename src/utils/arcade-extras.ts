import { CAREER_MILESTONES } from '../data/career-milestones';

export function shuffleItems<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const sample = random();
    const j = Math.floor(Math.max(0, Math.min(.999999999, Number.isFinite(sample) ? sample : 0)) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export const memoryTrophies = [
  { id: 'world-cup', symbol: '🌎', label: 'World Cup' },
  { id: 'copa', symbol: '🇦🇷', label: 'Copa América' },
  { id: 'champions', symbol: '⭐', label: 'Champions League' },
  { id: 'ballon', symbol: '🏆', label: 'Ballon d’Or' },
];
export interface MemoryCard { id: string; trophy: typeof memoryTrophies[number] }
export interface MemoryState { cards: MemoryCard[]; revealed: string[]; matched: string[]; turns: number }
export function newMemoryRound(random: () => number = Math.random): MemoryState {
  return { cards: shuffleItems(memoryTrophies.flatMap(trophy => [0, 1].map(copy => ({ id: `${trophy.id}-${copy}`, trophy }))), random), revealed: [], matched: [], turns: 0 };
}
export type MemoryAction = { type: 'flip'; id: string } | { type: 'continue' } | { type: 'reset'; cards: MemoryCard[] };
export function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
  if (action.type === 'reset') return { cards: action.cards, revealed: [], matched: [], turns: 0 };
  if (action.type === 'continue') return state.revealed.length === 2 ? { ...state, revealed: [] } : state;
  if (state.revealed.length >= 2 || state.revealed.includes(action.id) || state.matched.includes(action.id) || !state.cards.some(card => card.id === action.id)) return state;
  const revealed = [...state.revealed, action.id];
  const isMatch = revealed.length === 2 && state.cards.find(card => card.id === revealed[0])!.trophy.id === state.cards.find(card => card.id === revealed[1])!.trophy.id;
  return { ...state, revealed, turns: state.turns + Number(revealed.length === 2), matched: isMatch ? [...state.matched, ...revealed] : state.matched };
}
const timelineIds = ['barcelona-debut', 'rome-final', 'copa-america', 'world-cup-final', 'miami-debut'];
export const timelineMilestones = timelineIds.map(id => CAREER_MILESTONES.find(item => item.id === id)!);
export function moveTimelineItem(order: readonly string[], from: number, to: number): string[] {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= order.length || to >= order.length || from === to) return [...order];
  const next = [...order];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
export function timelineCorrectCount(order: readonly string[]): number {
  if (order.length !== timelineIds.length || new Set(order).size !== timelineIds.length || order.some(id => !timelineIds.includes(id))) return 0;
  return order.reduce((count, id, index) => count + Number(id === timelineIds[index]), 0);
}
