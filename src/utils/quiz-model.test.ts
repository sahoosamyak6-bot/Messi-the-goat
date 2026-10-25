import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ_QUESTIONS, questionsForDifficulty, type QuizDifficulty } from '../data/quiz-questions';
import { createQuizState, quizReducer, quizScore } from './quiz-model';

test('each difficulty has four unique sourced questions with valid answers', () => {
  assert.equal(new Set(QUIZ_QUESTIONS.map(q => q.id)).size, 12);
  for (const difficulty of ['easy', 'medium', 'hard'] as QuizDifficulty[]) {
    const questions = questionsForDifficulty(difficulty);
    assert.equal(questions.length, 4);
    for (const question of questions) {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.ok(['www.fcbarcelona.com', 'www.intermiamicf.com', 'www.fifa.com', 'inside.fifa.com'].includes(new URL(question.sourceUrl).hostname));
    }
  }
});
test('unanswered questions cannot be skipped and invalid options are ignored', () => {
  const state = createQuizState();
  const question = questionsForDifficulty('easy')[0];
  assert.equal(quizReducer(state, { type: 'next', questionId: question.id }), state);
  for (const option of [-1, 4, 1.5, NaN]) assert.equal(quizReducer(state, { type: 'answer', questionId: question.id, option }), state);
});
test('the first answer is final and repeated or stale actions cannot add points or skip questions', () => {
  const question = questionsForDifficulty('easy')[0];
  let state = createQuizState();
  state = quizReducer(state, { type: 'answer', questionId: question.id, option: question.correctIndex });
  assert.equal(quizScore(state), 1);
  assert.equal(quizReducer(state, { type: 'answer', questionId: question.id, option: 0 }), state);
  state = quizReducer(state, { type: 'next', questionId: question.id });
  assert.equal(state.index, 1);
  assert.equal(quizReducer(state, { type: 'next', questionId: question.id }), state);
  assert.equal(quizReducer(state, { type: 'answer', questionId: question.id, option: 0 }), state);
  assert.equal(quizScore(state), 1);
});
test('every difficulty completes with honest scores and cannot advance past the final question', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as QuizDifficulty[]) {
    let state = createQuizState(difficulty);
    const questions = questionsForDifficulty(difficulty);
    for (const [index, question] of questions.entries()) {
      state = quizReducer(state, { type: 'answer', questionId: question.id, option: index % 2 === 0 ? question.correctIndex : (question.correctIndex + 1) % 4 });
      state = quizReducer(state, { type: 'next', questionId: question.id });
    }
    assert.equal(state.completed, true);
    assert.equal(quizScore(state), 2);
    assert.equal(state.index, 3);
    assert.equal(quizReducer(state, { type: 'next', questionId: questions[3].id }), state);
  }
});
test('restart and changing difficulty reset all answers, progress and completion', () => {
  let state = createQuizState();
  const question = questionsForDifficulty('easy')[0];
  state = quizReducer(state, { type: 'answer', questionId: question.id, option: question.correctIndex });
  const restarted = quizReducer(state, { type: 'restart' });
  assert.deepEqual(restarted, createQuizState('easy', 1));
  assert.equal(quizScore(restarted), 0);
  const changed = quizReducer(state, { type: 'difficulty', difficulty: 'hard' });
  assert.deepEqual(changed, createQuizState('hard', 1));
  assert.equal(quizScore(changed), 0);
});
