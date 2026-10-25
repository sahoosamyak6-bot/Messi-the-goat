import { questionsForDifficulty, type QuizDifficulty } from '../data/quiz-questions';
export interface QuizState { difficulty: QuizDifficulty; index: number; answers: Record<string, number>; completed: boolean; attempt: number }
export const createQuizState = (difficulty: QuizDifficulty = 'easy', attempt = 0): QuizState => ({ difficulty, index: 0, answers: {}, completed: false, attempt });
export type QuizAction = { type: 'answer'; questionId: string; option: number } | { type: 'next'; questionId: string } | { type: 'restart' } | { type: 'difficulty'; difficulty: QuizDifficulty };
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === 'restart') return createQuizState(state.difficulty, state.attempt + 1);
  if (action.type === 'difficulty') return createQuizState(action.difficulty, state.attempt + 1);
  const questions = questionsForDifficulty(state.difficulty);
  const question = questions[state.index];
  if (state.completed || action.questionId !== question.id) return state;
  if (action.type === 'answer') {
    if (state.answers[question.id] !== undefined || !Number.isInteger(action.option) || action.option < 0 || action.option >= question.options.length) return state;
    return { ...state, answers: { ...state.answers, [question.id]: action.option } };
  }
  if (state.answers[question.id] === undefined) return state;
  return state.index === questions.length - 1 ? { ...state, completed: true } : { ...state, index: state.index + 1 };
}
export const quizScore = (state: QuizState) => questionsForDifficulty(state.difficulty).reduce((score, question) => score + Number(state.answers[question.id] === question.correctIndex), 0);
