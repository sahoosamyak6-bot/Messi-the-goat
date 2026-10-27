import { QUIZ_QUESTIONS } from '../data/quiz-questions';

export function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function dailyQuestion(dateKey: string) {
  let hash = 0;
  for (const char of dateKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return QUIZ_QUESTIONS[hash % QUIZ_QUESTIONS.length];
}
export interface DailyAttempt { date: string; questionId: string; choice: number }
export function parseDailyAttempt(raw: string | null, dateKey: string): DailyAttempt | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const item = value as Partial<DailyAttempt>;
    const question = dailyQuestion(dateKey);
    return item.date === dateKey && item.questionId === question.id && typeof item.choice === 'number' && Number.isInteger(item.choice) && item.choice >= 0 && item.choice < question.options.length ? { date: dateKey, questionId: question.id, choice: item.choice } : null;
  } catch { return null; }
}
