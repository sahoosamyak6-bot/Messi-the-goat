import { QUIZ_QUESTIONS } from '../data/quiz-questions';

// Reuse the archive's sourced, closed-event facts; the original difficulty quiz is unchanged.
export const triviaQuestions = QUIZ_QUESTIONS.slice(0, 8);
export const eraClues = [
  { question: 'I am the club where Messi scored 672 official goals before leaving in 2021.', options: ['FC Barcelona', 'Paris Saint-Germain', 'Inter Miami'], correctIndex: 0 },
  { question: 'I am the national team Messi captained to the 2022 World Cup title.', options: ['Spain', 'Argentina', 'France'], correctIndex: 1 },
  { question: 'My Messi chapter began with a match-winning free kick against Cruz Azul in 2023.', options: ['FC Barcelona', 'Paris Saint-Germain', 'Inter Miami'], correctIndex: 2 },
  { question: 'I am the tournament where Argentina beat France in the 2022 final.', options: ['Copa América', 'FIFA World Cup', 'Olympic Games'], correctIndex: 1 },
];
export type Direction = 0 | 1 | 2;
export interface PenaltyState { shots: number; goals: number; shot: Direction | null; keeper: Direction | null }
export const newPenaltyRound = (): PenaltyState => ({ shots: 0, goals: 0, shot: null, keeper: null });
export function takePenalty(state: PenaltyState, shot: Direction, keeper: Direction): PenaltyState {
  if (state.shots >= 5 || ![0, 1, 2].includes(shot) || ![0, 1, 2].includes(keeper)) return state;
  return { shots: state.shots + 1, goals: state.goals + Number(shot !== keeper), shot, keeper };
}
export function parseRecord(value: string | null, maximum: number, minimum = 0): number | null {
  if (value === null || value.trim() === '') return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum ? number : null;
}
export function reactionDelay(random: number): number {
  return 1500 + Math.floor(Math.max(0, Math.min(1, Number.isFinite(random) ? random : 0)) * 2500);
}
export function reactionMilliseconds(start: number, end: number): number | null {
  const elapsed = Math.round(end - start);
  return Number.isFinite(elapsed) && elapsed >= 1 && elapsed <= 60000 ? elapsed : null;
}
