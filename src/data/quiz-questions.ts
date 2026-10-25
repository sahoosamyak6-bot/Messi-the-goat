export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export interface SourcedQuizQuestion {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
  sourceUrl: string;
  sourceLabel: string;
}
const barca = 'https://www.fcbarcelona.com/en/football/first-team/news/2070529/leo-messi-fc-barcelonas-historic-record-breaker';
const miami = 'https://www.intermiamicf.com/news/match-recap-lionel-messi-scores-late-free-kick-winner-in-inter-miami-cf-debut';
const final = 'https://www.fifa.com/en/tournaments/mens/worldcup/articles/argentina-france-2022-final-greatest-games';
const cup = 'https://inside.fifa.com/en/tournaments/mens/worldcup/qatar2022/news/triumphant-argentina-conclude-unprecedented-fifa-world-cup';
// Historical, closed-event questions: no live career totals or speculative records.
// Official sources checked 25 October 2026. Difficulty is an editorial guide.
export const QUIZ_QUESTIONS: readonly SourcedQuizQuestion[] = [
  { id: 'easy-country', difficulty: 'easy', question: 'Which country did Messi captain to the 2022 World Cup title?', options: ['Brazil', 'Argentina', 'Spain', 'France'], correctIndex: 1, explanation: 'Messi captained Argentina to the title in Qatar.', sourceUrl: cup, sourceLabel: 'FIFA tournament review' },
  { id: 'easy-club', difficulty: 'easy', question: 'For which club did Messi score 672 official goals before leaving in 2021?', options: ['Paris Saint-Germain', 'Inter Miami', 'FC Barcelona', 'Newell’s Old Boys'], correctIndex: 2, explanation: 'His Barcelona career ended with 672 official goals.', sourceUrl: barca, sourceLabel: 'FC Barcelona record archive' },
  { id: 'easy-final', difficulty: 'easy', question: 'Who faced Argentina in the 2022 World Cup final?', options: ['France', 'Germany', 'Croatia', 'Netherlands'], correctIndex: 0, explanation: 'Argentina faced France at Lusail and won the penalty shootout.', sourceUrl: final, sourceLabel: 'FIFA final report' },
  { id: 'easy-miami', difficulty: 'easy', question: 'How did Messi score the winning goal on his Inter Miami debut?', options: ['Header', 'Penalty', 'Bicycle kick', 'Free kick'], correctIndex: 3, explanation: 'A late free kick secured Inter Miami’s debut win for Messi.', sourceUrl: miami, sourceLabel: 'Inter Miami match report' },
  { id: 'medium-opponent', difficulty: 'medium', question: 'Which team lost to Inter Miami in Messi’s debut match?', options: ['Atlanta United', 'Cruz Azul', 'Nashville SC', 'Orlando City'], correctIndex: 1, explanation: 'Inter Miami beat Cruz Azul 2–1 in the Leagues Cup.', sourceUrl: miami, sourceLabel: 'Inter Miami match report' },
  { id: 'medium-final-goals', difficulty: 'medium', question: 'How many goals did Messi score in the 2022 final, excluding the shootout?', options: ['One', 'Three', 'Two', 'Four'], correctIndex: 2, explanation: 'He scored in the 23rd and 108th minutes; shootout kicks are counted separately.', sourceUrl: final, sourceLabel: 'FIFA final report' },
  { id: 'medium-award', difficulty: 'medium', question: 'Which tournament award did Messi receive at Qatar 2022?', options: ['Golden Ball', 'Golden Glove', 'Golden Boot', 'Young Player Award'], correctIndex: 0, explanation: 'Messi received the Golden Ball; Mbappé won the Golden Boot.', sourceUrl: cup, sourceLabel: 'FIFA tournament review' },
  { id: 'medium-trophies', difficulty: 'medium', question: 'How many team trophies did Messi win with Barcelona?', options: ['25', '30', '32', '35'], correctIndex: 3, explanation: 'Barcelona records 35 team trophies during Messi’s spell at the club.', sourceUrl: barca, sourceLabel: 'FC Barcelona record archive' },
  { id: 'hard-appearances', difficulty: 'hard', question: 'How many official Barcelona appearances did Messi make?', options: ['767', '778', '800', '752'], correctIndex: 1, explanation: 'Messi finished his Barcelona career with 778 official appearances.', sourceUrl: barca, sourceLabel: 'FC Barcelona record archive' },
  { id: 'hard-minute', difficulty: 'hard', question: 'In which minute did Messi score his Inter Miami debut winner?', options: ['89th', '91st', '94th', '97th'], correctIndex: 2, explanation: 'The club’s match report records the free-kick winner in the 94th minute.', sourceUrl: miami, sourceLabel: 'Inter Miami match report' },
  { id: 'hard-cup-appearances', difficulty: 'hard', question: 'The 2022 final was which World Cup appearance of Messi’s career?', options: ['26th', '23rd', '24th', '25th'], correctIndex: 0, explanation: 'FIFA recorded his 26th World Cup appearance in the 2022 final.', sourceUrl: cup, sourceLabel: 'FIFA tournament review' },
  { id: 'hard-final-minute', difficulty: 'hard', question: 'In which minute did Messi score his extra-time goal in the 2022 final?', options: ['101st', '105th', '118th', '108th'], correctIndex: 3, explanation: 'Messi scored in the 108th minute before France equalised again.', sourceUrl: final, sourceLabel: 'FIFA final report' },
];
export const questionsForDifficulty = (difficulty: QuizDifficulty) => QUIZ_QUESTIONS.filter(question => question.difficulty === difficulty);
