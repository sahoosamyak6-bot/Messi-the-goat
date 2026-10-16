import type {
  CareerYearStat,
  TrophyItem,
  Era,
  IconicGoal,
  LegendQuote,
  QuizQuestion,
} from '../types/messi';

export interface SeasonStatDetail {
  season: string;
  club: string;
  leagueApps: number;
  leagueGoals: number;
  leagueAssists: number;
  continentalApps: number;
  continentalGoals: number;
  continentalAssists: number;
  cupApps: number;
  cupGoals: number;
  cupAssists: number;
  intlApps: number;
  intlGoals: number;
  intlAssists: number;
  totalApps: number;
  totalGoals: number;
  totalAssists: number;
  trophies: string[];
}

export interface CompetitionStat {
  competition: string;
  scope: 'Club' | 'International';
  apps: number;
  goals: number;
  assists: number;
  titles: number;
  notableRecord: string;
}

export interface BiographyChapter {
  id: string;
  title: string;
  eraRange: string;
  tagline: string;
  location: string;
  keyThemes: string[];
  content: string[];
  keyQuote?: {
    text: string;
    author: string;
  };
  metricsHighlight?: {
    label: string;
    value: string;
    sublabel: string;
  };
}

export const BIOGRAPHY_CHAPTERS: BiographyChapter[] = [
  {
    id: 'childhood',
    title: 'The Rosario Wonder & The Napkin Pact',
    eraRange: '1987 – 2004',
    tagline: 'From the streets of Barrio Las Heras to the legendary paper napkin in Barcelona.',
    location: 'Rosario, Argentina & Barcelona, Spain',
    keyThemes: ['Grandmother Celia', "The Machine of '87", 'GHD Diagnosis', 'The Napkin Contract', 'La Masia'],
    content: [
      'Lionel Andrés Messi was born on June 24, 1987, in Rosario, Santa Fe, the third of four children to Jorge Messi, a steel factory manager, and Celia Cuccittini, who worked in a magnet workshop. Surrounded by a football-obsessed family, Leo joined local club Grandoli at age four, where he was coached by his father. His maternal grandmother, Celia, was the first to recognize his generational talent, fiercely demanding the coach put the diminutive four-year-old on the pitch against boys two years older.',
      'To this day, every goal celebration pointing his fingers toward the sky remains a silent, sacred tribute to his grandmother, who passed away shortly before his professional ascent.',
      'At age six, he joined Newell’s Old Boys. Over six seasons with "The Machine of ’87", Messi scored an astounding 234 goals in 176 games. However, at age 10, his childhood was threatened when doctors diagnosed him with Growth Hormone Deficiency (GHD). The daily subcutaneous injections cost $900 a month—far beyond his family’s means and refused by local clubs during the Argentine economic crisis.',
      'In September 2000, Barcelona scout Charly Rexach arranged a trial. Spellbound within five minutes, Rexach was so desperate to ensure the prodigy did not slip through their fingers that on December 14, 2000, at the Pompeia tennis club, he famously drafted Messi’s first contract on a paper napkin. Barcelona agreed to cover the full medical treatments, and the 13-year-old left Rosario for Catalonia.'
    ],
    keyQuote: {
      text: 'I, Charly Rexach, technical secretary of FC Barcelona, declare under my responsibility and despite some opinions to the contrary, to sign the player Lionel Messi as long as we agree on the amounts.',
      author: 'Carles Rexach (The Napkin Agreement, 14 Dec 2000)'
    },
    metricsHighlight: {
      label: 'Newell’s Youth Record',
      value: '234 Goals',
      sublabel: 'in 176 games with "The Machine of 87"'
    }
  },
  {
    id: 'barcelona-dawn',
    title: 'The Debut, Ronaldinho & The Hexa-Glory',
    eraRange: '2004 – 2012',
    tagline: 'Pep Guardiola invents the False Nine, unleashing the greatest club dynasty in football history.',
    location: 'Camp Nou, Barcelona',
    keyThemes: ['First Goal vs Albacete', 'El Clásico 3-3', 'Pep Guardiola', 'False Nine', 'The 2009 Sextuple', 'Wembley 2011'],
    content: [
      'Messi made his competitive first-team debut on October 16, 2004 against Espanyol at age 17 years and 114 days. Mentored by two-time World Player of the Year Ronaldinho, Messi scored his first senior goal on May 1, 2005 against Albacete, executing an audacious chipped finish off Ronaldinho’s lofted assist and leaping onto the Brazilian’s back for one of the game’s most enduring photographs.',
      'In March 2007, a 19-year-old Messi announced himself to global sports royalty by scoring an epochal hat-trick in a 3-3 El Clásico against Real Madrid with Barcelona down to ten men. A month later, against Getafe in the Copa del Rey, he recreated Diego Maradona’s 1986 Goal of the Century, sprinting 60 meters past five defenders and rounding the keeper.',
      'When Pep Guardiola assumed management in 2008, he restructured Barcelona around Messi. In May 2009 at the Santiago Bernabéu, Guardiola unveiled Messi as a "False Nine", dropping between midfield and defense to pulverize Real Madrid 6-2. That calendar year, Barcelona achieved the historic Sextuple—winning La Liga, the Copa del Rey, UEFA Champions League, Supercopa de España, UEFA Super Cup, and FIFA Club World Cup—a clean sweep never before accomplished in the sport.',
      'The zenith culminated at Wembley in the 2011 Champions League final against Sir Alex Ferguson’s Manchester United. Delivering an untouchable masterclass with a thunderous 25-yard drive, Ferguson conceded: "No one has given us a hiding like that. He was unplayable."'
    ],
    keyQuote: {
      text: 'Do not write about him, do not try to describe him. Just watch him.',
      author: 'Pep Guardiola'
    },
    metricsHighlight: {
      label: '2009 Sextuple',
      value: '6 Trophies',
      sublabel: '100% of all available competitions won in a single calendar year'
    }
  },
  {
    id: 'the-zenith',
    title: 'The 91 Goals & The Unstoppable MSN Trident',
    eraRange: '2012 – 2017',
    tagline: 'An unbroken Guinness World Record followed by the most feared attacking trio in modern history.',
    location: 'Camp Nou, Barcelona',
    keyThemes: ['91 Goals in 2012', 'Gerd Müller Record', 'MSN Trio', '2015 Treble', '500th Goal at Bernabéu'],
    content: [
      'In 2012, Lionel Messi produced statistical numbers that severed ties with human limits. Across 69 matches for Barcelona and Argentina, he scored 91 goals (79 for Barcelona, 12 for Argentina), shattering Gerd Müller’s 40-year-old world record of 85 goals set in 1972. In the 2011-12 season alone, he notched 73 club goals and 29 assists.',
      'With the arrivals of Neymar Jr. in 2013 and Luis Suárez in 2014, Luis Enrique orchestrated the "MSN" attacking trident. Characterized by telepathic chemistry, selfless passing, and lethal execution, the South American trio scored an unprecedented 122 goals in their first season together, sweeping the 2014-15 Treble (La Liga, Copa del Rey, Champions League).',
      'The era provided unforgettable theater: leaving Jerome Boateng grounded on the Camp Nou turf before chipping Manuel Neuer in the 2015 Champions League semi-final; a mesmerising 50-meter solo wondergoal against Athletic Bilbao in the Copa del Rey final; and the 92nd-minute stoppage-time winner at the Bernabéu in April 2017 for his 500th Barcelona goal, where he calmly removed his jersey and displayed the number 10 to a stunned Madrid crowd.'
    ],
    keyQuote: {
      text: 'My record stood for 40 years and now the best player in the world has broken it. He is an incredible player, gigantic.',
      author: 'Gerd Müller (December 2012)'
    },
    metricsHighlight: {
      label: 'Guinness World Record',
      value: '91 Goals',
      sublabel: 'Scored in 69 matches in the 2012 calendar year'
    }
  },
  {
    id: 'barcelona-farewell',
    title: 'The Master Architect & The Tearful Goodbye',
    eraRange: '2017 – 2021',
    tagline: 'Carrying Barcelona with sublime free-kicks before financial regulations force an agonizing exit.',
    location: 'Barcelona, Spain',
    keyThemes: ['Captaincy', 'Free-Kick Dominance', '6th Ballon dOr', 'Copa del Rey 2021', 'Emotional Farewell'],
    content: [
      'Inheriting the captain’s armband following Andrés Iniesta’s departure, Messi evolved from a pure scoring machine into the world’s most complete footballing architect. Between 2016 and 2021, he transformed dead-ball strikes into an art form, scoring more direct free-kicks alone (30+) than entire European clubs combined.',
      'In 2019, he captured his record-setting sixth Ballon d’Or after guiding Barcelona to their 26th La Liga title. Even as institutional instability gripped the club, Messi continued to produce wonders—including a 35-yard laser free-kick against Liverpool in the 2019 Champions League semi-final.',
      'His final trophy in Blaugrana was the 2021 Copa del Rey, where he scored a sublime brace in a 4-0 demolition of Athletic Bilbao. In August 2021, despite agreeing to a 50% wage cut to remain at the only club he had known, La Liga’s strict financial fair play regulations prevented the contract registration. In a heart-wrenching press conference at Camp Nou, Messi wept openly while bidding farewell to 21 years, 778 appearances, 672 goals, and 35 trophies.'
    ],
    keyQuote: {
      text: 'I grew up in the club and I became the man I am here. I gave everything for this shirt from the first day to the last.',
      author: 'Lionel Messi (Farewell Press Conference, August 8, 2021)'
    },
    metricsHighlight: {
      label: 'Barcelona Legacy',
      value: '672 Goals / 35 Trophies',
      sublabel: 'All-time top scorer and most decorated player in FC Barcelona history'
    }
  },
  {
    id: 'psg-interlude',
    title: 'The Parisian Chapter & European Playmaking Mastery',
    eraRange: '2021 – 2023',
    tagline: 'Embracing the number 30 jersey and dictating play at the Parc des Princes.',
    location: 'Paris, France',
    keyThemes: ['Number 30', 'Ligue 1 Champions', 'Europe Assist Leader', 'Reunion with Neymar'],
    content: [
      'On August 10, 2021, Messi signed with Paris Saint-Germain, reuniting with Neymar and pairing with Kylian Mbappé. Respectfully refusing the number 10 shirt from Neymar, Messi chose number 30—the number he wore on his senior debut in 2004.',
      'His first Parisian goal arrived in vintage fashion on September 28, 2021, curling a strike into the top corner against Manchester City in the Champions League following a slick one-two with Mbappé.',
      'Over two seasons in France, Messi adapted into an elite deep-lying playmaker. He collected back-to-back Ligue 1 titles (2021-22, 2022-23) and the 2022 Trophée des Champions. In the 2022-23 campaign, he led the continent with 21 goals and 20 assists in all competitions, orchestrating PSG’s attack with surgical vision.'
    ],
    keyQuote: {
      text: 'Playing alongside Leo was a dream. In Paris, his vision of the pitch was two seconds ahead of everyone else.',
      author: 'Kylian Mbappé'
    },
    metricsHighlight: {
      label: 'Parisian Contribution',
      value: '32G / 35A',
      sublabel: 'in 75 appearances across two Ligue 1 title campaigns'
    }
  },
  {
    id: 'argentina-redemption',
    title: 'The Albiceleste Glory: From Agony to Lusail Immortality',
    eraRange: '2005 – 2024',
    tagline: 'Overcoming years of heartbreak to conquer the Copa América, Finalissima, and 2022 FIFA World Cup.',
    location: 'Maracanã, Rio de Janeiro & Lusail Stadium, Qatar',
    keyThemes: ['2014 World Cup Heartbreak', 'Scaloneta', 'Maracanã 2021', 'Finalissima 2022', 'Lusail 2022', 'Copa América 2024'],
    content: [
      'For over a decade, Messi carried the heavy expectation of an entire nation yearning for a successor to Diego Maradona. Despite carrying Argentina to three consecutive major finals—the 2014 World Cup Final in Brazil, and the 2015 and 2016 Copa América finals—agonizing extra-time and penalty defeats left deep scars.',
      'The turning point occurred under manager Lionel Scaloni. Unifying a squad of devoted younger players who grew up idolizing him (Julián Álvarez, Rodrigo De Paul, Emiliano Martínez), "La Scaloneta" forged an unbreakable brotherhood.',
      'On July 10, 2021, the 28-year national trophy drought was vanquished. Argentina defeated arch-rivals Brazil 1-0 inside the iconic Maracanã Stadium to win the 2021 Copa América. Messi was named Best Player and Top Scorer. At the final whistle, the entire Argentine team rushed past celebrations to toss Messi into the air.',
      'A year later, Argentina dismantled European champions Italy 3-0 at Wembley in the 2022 Finalissima, setting the stage for Qatar. At the 2022 FIFA World Cup, Messi produced the crowning opus of his life. At age 35, he scored 7 goals and provided 3 assists, becoming the first player in World Cup history to score in every single knockout round (Round of 16 vs Australia, Quarter-final vs Netherlands, Semi-final vs Croatia, and a brace in the Final vs France).',
      'The December 18, 2022 final at Lusail Stadium is universally hailed as the greatest football match ever played. After a breathless 3-3 draw across 120 minutes, Argentina prevailed 4-2 on penalties. Cloaked in the golden Bisht robe by the Emir of Qatar, Messi finally lifted the 18-karat gold World Cup trophy into the Doha sky, cementing his immortal place as football’s undisputed greatest.'
    ],
    keyQuote: {
      text: 'I wanted this so much. God was going to give it to me, I had a feeling that this was the one. Now we can finally celebrate.',
      author: 'Lionel Andrés Messi (World Cup Champion, 18 December 2022)'
    },
    metricsHighlight: {
      label: '2022 World Cup Golden Ball',
      value: '7 Goals / 3 Assists',
      sublabel: 'Only player in football history to win two FIFA World Cup Golden Balls (2014, 2022)'
    }
  },
  {
    id: 'miami-sunrise',
    title: 'The American Revolution & The 46-Trophy Summit',
    eraRange: '2023 – Present',
    tagline: 'Transforming North American soccer, lifting Inter Miami’s first silverware, and becoming the most decorated player in history.',
    location: 'Chase Stadium, Fort Lauderdale, Florida',
    keyThemes: ['MLS Arrival', 'Leagues Cup 2023', 'Supporters Shield 2024', '46 Trophies Record', 'David Beckham'],
    content: [
      'In July 2023, Messi ignited global sports culture by signing with Inter Miami CF in Major League Soccer. On his debut against Cruz Azul on July 21, with LeBron James, Serena Williams, and Kim Kardashian watching from the touchline, Messi struck a fairy-tale 94th-minute curled free-kick into the top corner to seal a 2-1 victory.',
      'Within just one month, Messi led the last-placed MLS club on an undefeated run to capture the 2023 Leagues Cup—the first trophy in Inter Miami’s history. Messi finished as the tournament’s top scorer with 10 goals in 7 matches.',
      'In October 2023, he received his unprecedented eighth Ballon d’Or in Paris, becoming the first active MLS player to win football’s supreme honor. In 2024, reunited with former Barcelona teammates Sergio Busquets, Jordi Alba, and Luis Suárez, Messi powered Inter Miami to the 2024 MLS Supporters’ Shield with a league-record 74 points.',
      'With the 2024 Supporters’ Shield and the 2024 Copa América title, Messi raised his career silverware count to 46 official trophies—officially surpassing Dani Alves to become the most decorated player in the 160-year history of association football.'
    ],
    keyQuote: {
      text: 'To bring the greatest player in history to Miami was the greatest moment of my life in sport. Every time he touches the ball, something magical happens.',
      author: 'David Beckham (Inter Miami Co-Owner)'
    },
    metricsHighlight: {
      label: 'World Record Silverware',
      value: '46 Trophies',
      sublabel: 'The most decorated association footballer of all time'
    }
  }
];

export const SEASON_BY_SEASON_STATS: SeasonStatDetail[] = [
  {
    season: '2004-05',
    club: 'FC Barcelona',
    leagueApps: 7,
    leagueGoals: 1,
    leagueAssists: 0,
    continentalApps: 1,
    continentalGoals: 0,
    continentalAssists: 0,
    cupApps: 1,
    cupGoals: 0,
    cupAssists: 0,
    intlApps: 2,
    intlGoals: 0,
    intlAssists: 0,
    totalApps: 11,
    totalGoals: 1,
    totalAssists: 0,
    trophies: ['La Liga', 'FIFA World Youth Championship (Argentina U-20)']
  },
  {
    season: '2005-06',
    club: 'FC Barcelona',
    leagueApps: 17,
    leagueGoals: 6,
    leagueAssists: 2,
    continentalApps: 6,
    continentalGoals: 1,
    continentalAssists: 1,
    cupApps: 2,
    cupGoals: 1,
    cupAssists: 0,
    intlApps: 10,
    intlGoals: 2,
    intlAssists: 2,
    totalApps: 35,
    totalGoals: 10,
    totalAssists: 5,
    trophies: ['UEFA Champions League', 'La Liga', 'Supercopa de España']
  },
  {
    season: '2006-07',
    club: 'FC Barcelona',
    leagueApps: 26,
    leagueGoals: 14,
    leagueAssists: 2,
    continentalApps: 5,
    continentalGoals: 1,
    continentalAssists: 0,
    cupApps: 4,
    cupGoals: 2,
    cupAssists: 1,
    intlApps: 10,
    intlGoals: 4,
    intlAssists: 4,
    totalApps: 45,
    totalGoals: 21,
    totalAssists: 7,
    trophies: ['Supercopa de España', 'Copa América Runner-up']
  },
  {
    season: '2007-08',
    club: 'FC Barcelona',
    leagueApps: 28,
    leagueGoals: 10,
    leagueAssists: 12,
    continentalApps: 9,
    continentalGoals: 6,
    continentalAssists: 1,
    cupApps: 3,
    cupGoals: 0,
    cupAssists: 0,
    intlApps: 10,
    intlGoals: 3,
    intlAssists: 3,
    totalApps: 50,
    totalGoals: 19,
    totalAssists: 16,
    trophies: ['Olympic Gold Medal (Beijing 2008)']
  },
  {
    season: '2008-09',
    club: 'FC Barcelona',
    leagueApps: 31,
    leagueGoals: 23,
    leagueAssists: 11,
    continentalApps: 12,
    continentalGoals: 9,
    continentalAssists: 5,
    cupApps: 8,
    cupGoals: 6,
    cupAssists: 2,
    intlApps: 9,
    intlGoals: 3,
    intlAssists: 2,
    totalApps: 60,
    totalGoals: 41,
    totalAssists: 20,
    trophies: ['UEFA Champions League', 'La Liga', 'Copa del Rey (Treble)', 'Ballon dOr 2009']
  },
  {
    season: '2009-10',
    club: 'FC Barcelona',
    leagueApps: 35,
    leagueGoals: 34,
    leagueAssists: 12,
    continentalApps: 11,
    continentalGoals: 8,
    continentalAssists: 0,
    cupApps: 7,
    cupGoals: 5,
    cupAssists: 0,
    intlApps: 11,
    intlGoals: 1,
    intlAssists: 4,
    totalApps: 64,
    totalGoals: 48,
    totalAssists: 16,
    trophies: ['La Liga', 'FIFA Club World Cup', 'UEFA Super Cup', 'Supercopa de España', 'European Golden Shoe', 'Ballon dOr 2010']
  },
  {
    season: '2010-11',
    club: 'FC Barcelona',
    leagueApps: 33,
    leagueGoals: 31,
    leagueAssists: 18,
    continentalApps: 13,
    continentalGoals: 12,
    continentalAssists: 3,
    cupApps: 9,
    cupGoals: 10,
    cupAssists: 3,
    intlApps: 11,
    intlGoals: 4,
    intlAssists: 4,
    totalApps: 66,
    totalGoals: 57,
    totalAssists: 28,
    trophies: ['UEFA Champions League', 'La Liga', 'Supercopa de España', 'Ballon dOr 2011']
  },
  {
    season: '2011-12',
    club: 'FC Barcelona',
    leagueApps: 37,
    leagueGoals: 50,
    leagueAssists: 16,
    continentalApps: 11,
    continentalGoals: 14,
    continentalAssists: 5,
    cupApps: 12,
    cupGoals: 9,
    cupAssists: 8,
    intlApps: 9,
    intlGoals: 9,
    intlAssists: 4,
    totalApps: 69,
    totalGoals: 82,
    totalAssists: 33,
    trophies: ['Copa del Rey', 'FIFA Club World Cup', 'UEFA Super Cup', 'Supercopa de España', 'European Golden Shoe (Record 50 League Goals)', 'Guinness World Record 91 Goals (2012)', 'Ballon dOr 2012']
  },
  {
    season: '2012-13',
    club: 'FC Barcelona',
    leagueApps: 32,
    leagueGoals: 46,
    leagueAssists: 12,
    continentalApps: 11,
    continentalGoals: 8,
    continentalAssists: 2,
    cupApps: 7,
    cupGoals: 6,
    cupAssists: 1,
    intlApps: 9,
    intlGoals: 5,
    intlAssists: 3,
    totalApps: 59,
    totalGoals: 65,
    totalAssists: 18,
    trophies: ['La Liga (100 Points Record)', 'European Golden Shoe']
  },
  {
    season: '2013-14',
    club: 'FC Barcelona',
    leagueApps: 31,
    leagueGoals: 28,
    leagueAssists: 11,
    continentalApps: 7,
    continentalGoals: 8,
    continentalAssists: 0,
    cupApps: 8,
    cupGoals: 5,
    cupAssists: 3,
    intlApps: 14,
    intlGoals: 8,
    intlAssists: 2,
    totalApps: 60,
    totalGoals: 49,
    totalAssists: 16,
    trophies: ['Supercopa de España', 'FIFA World Cup Finalist & Golden Ball 2014']
  },
  {
    season: '2014-15',
    club: 'FC Barcelona',
    leagueApps: 38,
    leagueGoals: 43,
    leagueAssists: 18,
    continentalApps: 13,
    continentalGoals: 10,
    continentalAssists: 6,
    cupApps: 6,
    cupGoals: 5,
    cupAssists: 4,
    intlApps: 10,
    intlGoals: 4,
    intlAssists: 3,
    totalApps: 67,
    totalGoals: 62,
    totalAssists: 31,
    trophies: ['UEFA Champions League', 'La Liga', 'Copa del Rey (Treble)', 'Ballon dOr 2015']
  },
  {
    season: '2015-16',
    club: 'FC Barcelona',
    leagueApps: 33,
    leagueGoals: 26,
    leagueAssists: 16,
    continentalApps: 7,
    continentalGoals: 6,
    continentalAssists: 1,
    cupApps: 9,
    cupGoals: 9,
    cupAssists: 6,
    intlApps: 10,
    intlGoals: 9,
    intlAssists: 4,
    totalApps: 59,
    totalGoals: 50,
    totalAssists: 27,
    trophies: ['La Liga', 'Copa del Rey', 'FIFA Club World Cup', 'UEFA Super Cup', 'Copa América Centenario Finalist']
  },
  {
    season: '2016-17',
    club: 'FC Barcelona',
    leagueApps: 34,
    leagueGoals: 37,
    leagueAssists: 9,
    continentalApps: 9,
    continentalGoals: 11,
    continentalAssists: 2,
    cupApps: 9,
    cupGoals: 6,
    cupAssists: 4,
    intlApps: 5,
    intlGoals: 4,
    intlAssists: 0,
    totalApps: 57,
    totalGoals: 58,
    totalAssists: 15,
    trophies: ['Copa del Rey', 'Supercopa de España', 'European Golden Shoe']
  },
  {
    season: '2017-18',
    club: 'FC Barcelona',
    leagueApps: 36,
    leagueGoals: 34,
    leagueAssists: 12,
    continentalApps: 10,
    continentalGoals: 6,
    continentalAssists: 2,
    cupApps: 8,
    cupGoals: 5,
    cupAssists: 4,
    intlApps: 10,
    intlGoals: 7,
    intlAssists: 3,
    totalApps: 64,
    totalGoals: 52,
    totalAssists: 21,
    trophies: ['La Liga (Domestic Double)', 'Copa del Rey', 'European Golden Shoe']
  },
  {
    season: '2018-19',
    club: 'FC Barcelona',
    leagueApps: 34,
    leagueGoals: 36,
    leagueAssists: 13,
    continentalApps: 10,
    continentalGoals: 12,
    continentalAssists: 3,
    cupApps: 6,
    cupGoals: 3,
    cupAssists: 3,
    intlApps: 8,
    intlGoals: 3,
    intlAssists: 1,
    totalApps: 58,
    totalGoals: 54,
    totalAssists: 20,
    trophies: ['La Liga', 'Supercopa de España', 'European Golden Shoe', 'Ballon dOr 2019']
  },
  {
    season: '2019-20',
    club: 'FC Barcelona',
    leagueApps: 33,
    leagueGoals: 25,
    leagueAssists: 21,
    continentalApps: 8,
    continentalGoals: 3,
    continentalAssists: 3,
    cupApps: 3,
    cupGoals: 3,
    cupAssists: 1,
    intlApps: 2,
    intlGoals: 1,
    intlAssists: 0,
    totalApps: 46,
    totalGoals: 32,
    totalAssists: 25,
    trophies: ['La Liga 20+ Goals & 20+ Assists Record', 'Pichichi Record 7th Trophy']
  },
  {
    season: '2020-21',
    club: 'FC Barcelona',
    leagueApps: 35,
    leagueGoals: 30,
    leagueAssists: 9,
    continentalApps: 6,
    continentalGoals: 5,
    continentalAssists: 2,
    cupApps: 6,
    cupGoals: 3,
    cupAssists: 1,
    intlApps: 13,
    intlGoals: 6,
    intlAssists: 5,
    totalApps: 60,
    totalGoals: 44,
    totalAssists: 17,
    trophies: ['Copa del Rey (Final Barca Trophy)', 'Copa América Champion 2021', 'Ballon dOr 2021']
  },
  {
    season: '2021-22',
    club: 'Paris Saint-Germain',
    leagueApps: 26,
    leagueGoals: 6,
    leagueAssists: 14,
    continentalApps: 7,
    continentalGoals: 5,
    continentalAssists: 0,
    cupApps: 1,
    cupGoals: 0,
    cupAssists: 0,
    intlApps: 16,
    intlGoals: 16,
    intlAssists: 2,
    totalApps: 50,
    totalGoals: 27,
    totalAssists: 16,
    trophies: ['Ligue 1', 'Finalissima Champion (Wembley)']
  },
  {
    season: '2022-23',
    club: 'Paris Saint-Germain',
    leagueApps: 32,
    leagueGoals: 16,
    leagueAssists: 16,
    continentalApps: 7,
    continentalGoals: 4,
    continentalAssists: 4,
    cupApps: 2,
    cupGoals: 1,
    cupAssists: 0,
    intlApps: 13,
    intlGoals: 17,
    intlAssists: 5,
    totalApps: 54,
    totalGoals: 38,
    totalAssists: 25,
    trophies: ['FIFA World Cup Champion (Qatar 2022)', 'World Cup Golden Ball', 'Ligue 1', 'Trophée des Champions', 'Ballon dOr 2023']
  },
  {
    season: '2023',
    club: 'Inter Miami CF',
    leagueApps: 6,
    leagueGoals: 1,
    leagueAssists: 2,
    continentalApps: 7,
    continentalGoals: 10,
    continentalAssists: 1,
    cupApps: 1,
    cupGoals: 0,
    cupAssists: 2,
    intlApps: 8,
    intlGoals: 8,
    intlAssists: 1,
    totalApps: 22,
    totalGoals: 19,
    totalAssists: 6,
    trophies: ['Leagues Cup Champion 2023 (Top Scorer)', '8th Ballon dOr']
  },
  {
    season: '2024',
    club: 'Inter Miami CF',
    leagueApps: 19,
    leagueGoals: 20,
    leagueAssists: 16,
    continentalApps: 3,
    continentalGoals: 2,
    continentalAssists: 2,
    cupApps: 0,
    cupGoals: 0,
    cupAssists: 0,
    intlApps: 11,
    intlGoals: 6,
    intlAssists: 5,
    totalApps: 33,
    totalGoals: 28,
    totalAssists: 23,
    trophies: ['Copa América Champion 2024', 'MLS Supporters Shield (Record 74 Pts)', '46th Official Career Trophy']
  },
  {
    season: '2025',
    club: 'Inter Miami CF',
    leagueApps: 8,
    leagueGoals: 7,
    leagueAssists: 5,
    continentalApps: 4,
    continentalGoals: 3,
    continentalAssists: 2,
    cupApps: 1,
    cupGoals: 1,
    cupAssists: 1,
    intlApps: 4,
    intlGoals: 2,
    intlAssists: 2,
    totalApps: 17,
    totalGoals: 13,
    totalAssists: 10,
    trophies: ['CONCACAF Champions Cup Contender', 'FIFA Club World Cup 2025 Qualifier']
  }
];

export const CLUB_COUNTRY_TOTALS = [
  {
    team: 'FC Barcelona',
    period: '2004 – 2021',
    apps: 778,
    goals: 672,
    assists: 303,
    trophies: 35,
    gpg: '0.86',
    apg: '0.39',
    honorsSummary: '10x La Liga, 4x UEFA Champions League, 7x Copa del Rey, 8x Supercopa, 3x Club World Cup, 3x UEFA Super Cup'
  },
  {
    team: 'Paris Saint-Germain',
    period: '2021 – 2023',
    apps: 75,
    goals: 32,
    assists: 35,
    trophies: 3,
    gpg: '0.43',
    apg: '0.47',
    honorsSummary: '2x Ligue 1 (2022, 2023), 1x Trophée des Champions (2022)'
  },
  {
    team: 'Inter Miami CF',
    period: '2023 – Present',
    apps: 48,
    goals: 37,
    assists: 25,
    trophies: 2,
    gpg: '0.77',
    apg: '0.52',
    honorsSummary: '1x Leagues Cup (2023), 1x MLS Supporters Shield (2024 - record 74 points)'
  },
  {
    team: 'Argentina National Team',
    period: '2005 – Present',
    apps: 191,
    goals: 112,
    assists: 60,
    trophies: 6,
    gpg: '0.59',
    apg: '0.31',
    honorsSummary: '1x FIFA World Cup (2022), 2x Copa América (2021, 2024), 1x Finalissima (2022), 1x Olympic Gold (2008), 1x U-20 World Cup (2005)'
  }
];

export const COMPETITION_BREAKDOWN: CompetitionStat[] = [
  {
    competition: 'La Liga (Spain)',
    scope: 'Club',
    apps: 520,
    goals: 474,
    assists: 216,
    titles: 10,
    notableRecord: 'All-time highest goalscorer & assist provider in Spanish league history'
  },
  {
    competition: 'UEFA Champions League',
    scope: 'Club',
    apps: 163,
    goals: 129,
    assists: 45,
    titles: 4,
    notableRecord: 'Most goals for a single club (120 for Barca); top scorer in 6 seasons'
  },
  {
    competition: 'Copa del Rey',
    scope: 'Club',
    apps: 80,
    goals: 56,
    assists: 36,
    titles: 7,
    notableRecord: 'Scored in 4 consecutive Copa del Rey finals; 56 goals in 80 matches'
  },
  {
    competition: 'FIFA World Cup',
    scope: 'International',
    apps: 26,
    goals: 13,
    assists: 8,
    titles: 1,
    notableRecord: 'Most appearances in World Cup history (26) & scored in every knockout stage in 2022'
  },
  {
    competition: 'Copa América',
    scope: 'International',
    apps: 39,
    goals: 14,
    assists: 18,
    titles: 2,
    notableRecord: 'Most matches played in Copa América history (39); back-to-back champions (2021, 2024)'
  },
  {
    competition: 'Ligue 1 (France)',
    scope: 'Club',
    apps: 58,
    goals: 22,
    assists: 30,
    titles: 2,
    notableRecord: 'Led Ligue 1 in assists in 2022-23 (16 assists)'
  },
  {
    competition: 'Major League Soccer',
    scope: 'Club',
    apps: 25,
    goals: 21,
    assists: 18,
    titles: 1,
    notableRecord: 'Fastest player in MLS history to reach 25 goal contributions in a season'
  },
  {
    competition: 'Leagues Cup',
    scope: 'Club',
    apps: 7,
    goals: 10,
    assists: 1,
    titles: 1,
    notableRecord: 'Scored in all 7 matches in 2023 tournament run to secure Inter Miamis first trophy'
  },
  {
    competition: 'FIFA Club World Cup',
    scope: 'Club',
    apps: 5,
    goals: 5,
    assists: 1,
    titles: 3,
    notableRecord: 'Scored in all three Club World Cup finals he played in (2009, 2011, 2015)'
  }
];

export const TROPHIES_DATA: TrophyItem[] = [
  {
    id: 'world-cup-2022',
    name: 'FIFA World Cup',
    category: 'international',
    count: 1,
    years: [2022],
    team: 'Argentina',
    description: 'The holy grail of global sports, won in breathtaking fashion in Lusail, Qatar.',
    significance: 'Completed football. Named Golden Ball winner with 7 goals and 3 assists.',
    highlightYear: 2022,
    highlightDetail: 'Defeated France 3-3 (4-2 p.k.) in the greatest final ever played.'
  },
  {
    id: 'copa-america',
    name: 'Copa América',
    category: 'international',
    count: 2,
    years: [2021, 2024],
    team: 'Argentina',
    description: 'South American continental championship triumph.',
    significance: '2021 victory at the Maracanã ended Argentina’s 28-year senior drought.',
    highlightYear: 2021,
    highlightDetail: '1-0 vs Brazil at Maracanã; Best Player & Top Scorer.'
  },
  {
    id: 'finalissima',
    name: 'CONMEBOL–UEFA Cup of Champions (Finalissima)',
    category: 'international',
    count: 1,
    years: [2022],
    team: 'Argentina',
    description: 'Clash between the champions of South America and Europe.',
    significance: 'A 3-0 demolition of Euro 2020 champions Italy at Wembley Stadium.',
    highlightYear: 2022,
    highlightDetail: 'Player of the Match with 2 sublime assists.'
  },
  {
    id: 'olympic-gold',
    name: 'Olympic Gold Medal',
    category: 'international',
    count: 1,
    years: [2008],
    team: 'Argentina',
    description: 'Beijing 2008 Summer Olympic Games gold medal with Argentina U-23.',
    significance: 'Assisted Ángel Di María’s famous chip in the final against Nigeria.',
    highlightYear: 2008,
    highlightDetail: 'Unbeaten tournament run alongside Riquelme and Agüero.'
  },
  {
    id: 'u20-world-cup',
    name: 'FIFA World Youth Championship (U-20)',
    category: 'international',
    count: 1,
    years: [2005],
    team: 'Argentina',
    description: 'World Under-20 crown in the Netherlands.',
    significance: 'Awarded both the Golden Ball (Best Player) and Golden Shoe (6 goals).',
    highlightYear: 2005,
    highlightDetail: 'Scored twice in the final to defeat Nigeria 2-1.'
  },
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    category: 'continental',
    count: 4,
    years: [2006, 2009, 2011, 2015],
    team: 'FC Barcelona',
    description: 'Europe’s supreme club competition.',
    significance: 'Scored in two finals (2009 Rome vs Man Utd, 2011 Wembley vs Man Utd).',
    highlightYear: 2011,
    highlightDetail: 'Pivotal masterclass at Wembley in a 3-1 win over Manchester United.'
  },
  {
    id: 'la-liga',
    name: 'La Liga (Spanish League)',
    category: 'domestic_league',
    count: 10,
    years: [2005, 2006, 2009, 2010, 2011, 2013, 2015, 2016, 2018, 2019],
    team: 'FC Barcelona',
    description: 'The Spanish top-flight league championship.',
    significance: 'Most league titles ever won by a non-Spanish player.',
    highlightYear: 2012,
    highlightDetail: 'Scored a historic 50 league goals in a single season (2011-12).'
  },
  {
    id: 'copa-del-rey',
    name: 'Copa del Rey',
    category: 'domestic_cup',
    count: 7,
    years: [2009, 2012, 2015, 2016, 2017, 2018, 2021],
    team: 'FC Barcelona',
    description: 'Spain’s prestigious domestic knockout cup competition.',
    significance: 'Scored in four different finals, including his final trophy for Barcelona.',
    highlightYear: 2015,
    highlightDetail: 'Legendary solo dribble goal from the halfway line vs Athletic Bilbao.'
  },
  {
    id: 'club-world-cup',
    name: 'FIFA Club World Cup',
    category: 'continental',
    count: 3,
    years: [2009, 2011, 2015],
    team: 'FC Barcelona',
    description: 'Intercontinental showdown of continental champions.',
    significance: 'Scored in all 3 finals he contested (including chest goal vs Estudiantes in 2009).',
    highlightYear: 2009,
    highlightDetail: '110th minute chest-goal winner against Estudiantes to seal the Sextuple.'
  },
  {
    id: 'uefa-super-cup',
    name: 'UEFA Super Cup',
    category: 'continental',
    count: 3,
    years: [2009, 2011, 2015],
    team: 'FC Barcelona',
    description: 'Annual match between UEFA Champions League and Europa League winners.',
    significance: 'Two direct free-kick goals in a memorable 5-4 thriller vs Sevilla in 2015.',
    highlightYear: 2015,
    highlightDetail: 'Brace of sensational free-kicks in Tbilisi.'
  },
  {
    id: 'supercopa-espana',
    name: 'Supercopa de España',
    category: 'domestic_cup',
    count: 8,
    years: [2005, 2006, 2009, 2010, 2011, 2013, 2016, 2018],
    team: 'FC Barcelona',
    description: 'Spanish curtain-raiser super cup.',
    significance: 'All-time top scorer in Supercopa history (14 goals).',
    highlightYear: 2011,
    highlightDetail: 'Aggregated 3 goals and 2 assists over Real Madrid in a fierce two-leg clash.'
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1 (France)',
    category: 'domestic_league',
    count: 2,
    years: [2022, 2023],
    team: 'Paris Saint-Germain',
    description: 'French championship top division.',
    significance: 'Won consecutive league titles during his two seasons in France.',
    highlightYear: 2023,
    highlightDetail: '16 goals and 16 assists in the 2022-23 championship campaign.'
  },
  {
    id: 'trophee-des-champions',
    name: 'Trophée des Champions',
    category: 'domestic_cup',
    count: 1,
    years: [2022],
    team: 'Paris Saint-Germain',
    description: 'French super cup match.',
    significance: 'Scored the opening goal in Tel Aviv against Nantes.',
    highlightYear: 2022,
    highlightDetail: '4-0 victory over Nantes, awarded Player of the Match.'
  },
  {
    id: 'leagues-cup',
    name: 'Leagues Cup (North America)',
    category: 'continental',
    count: 1,
    years: [2023],
    team: 'Inter Miami',
    description: 'Tournament featuring all MLS and Liga MX clubs.',
    significance: 'Delivered Inter Miami’s first-ever club trophy within a month of arrival.',
    highlightYear: 2023,
    highlightDetail: 'Top scorer (10 goals in 7 games), scoring in every single match.'
  },
  {
    id: 'mls-supporters-shield',
    name: 'MLS Supporters’ Shield',
    category: 'domestic_league',
    count: 1,
    years: [2024],
    team: 'Inter Miami',
    description: 'Awarded to the MLS club with the best regular season record.',
    significance: 'Set the all-time MLS points record (74 points); marked Messi’s 46th career trophy.',
    highlightYear: 2024,
    highlightDetail: 'Scored twice in the title-clinching 3-2 victory against Columbus Crew.'
  },
  // Individual Honors
  {
    id: 'ballon-dor',
    name: "Ballon d'Or",
    category: 'individual',
    count: 8,
    years: [2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023],
    team: 'Individual',
    description: 'Awarded by France Football to the best player on planet Earth.',
    significance: 'All-time world record (8 victories spanning across 3 different decades).',
    highlightYear: 2023,
    highlightDetail: 'Awarded 8th trophy following his heroic 2022 World Cup campaign in Qatar.'
  },
  {
    id: 'golden-shoe',
    name: 'European Golden Shoe',
    category: 'individual',
    count: 6,
    years: [2010, 2012, 2013, 2017, 2018, 2019],
    team: 'Individual',
    description: 'Given to the leading league goalscorer in all European domestic leagues.',
    significance: 'All-time world record. Includes 50 league goals in 2011-12.',
    highlightYear: 2012,
    highlightDetail: 'Record 50 league goals (100 points).'
  },
  {
    id: 'wc-golden-ball',
    name: 'FIFA World Cup Golden Ball',
    category: 'individual',
    count: 2,
    years: [2014, 2022],
    team: 'Individual',
    description: 'Awarded to the most outstanding player of the FIFA World Cup tournament.',
    significance: 'Only player in the 94-year history of the World Cup to win twice.',
    highlightYear: 2022,
    highlightDetail: '7 goals, 3 assists, and Man of the Match in 5 out of 7 tournament games.'
  },
  {
    id: 'pichichi',
    name: 'Pichichi Trophy (La Liga Top Scorer)',
    category: 'individual',
    count: 8,
    years: [2010, 2012, 2013, 2017, 2018, 2019, 2020, 2021],
    team: 'Individual',
    description: 'Top goalscorer in Spain’s Primera División.',
    significance: 'All-time record in Spanish football history, surpassing Telmo Zarra (6).',
    highlightYear: 2021,
    highlightDetail: 'Won 5 consecutive Pichichis between 2017 and 2021.'
  },
  {
    id: 'fifa-best',
    name: 'The Best FIFA Men’s Player / FIFA World Player',
    category: 'individual',
    count: 3,
    years: [2009, 2019, 2022, 2023],
    team: 'Individual',
    description: 'Official world player of the year honor voted by captains and managers.',
    significance: 'Consistently voted top player across eras and national federations.',
    highlightYear: 2022,
    highlightDetail: 'Overwhelming vote majority following the Qatar World Cup triumph.'
  },
  {
    id: 'laureus-world-sportsman',
    name: 'Laureus World Sportsman of the Year',
    category: 'individual',
    count: 2,
    years: [2020, 2023],
    team: 'Individual',
    description: 'Global athletic excellence across all sports disciplines.',
    significance: 'The only team-sport athlete in Laureus history to win this award.',
    highlightYear: 2023,
    highlightDetail: 'Won both World Sportsman and World Team of the Year (Argentina) in 2023.'
  }
];

export interface IconicMoment {
  id: string;
  title: string;
  subtitle: string;
  category: 'goal' | 'performance' | 'celebration' | 'trophy';
  year: number;
  date: string;
  opponent: string;
  competition: string;
  venue: string;
  description: string;
  tacticalAnalysis: string;
  imageUrl: string;
  videoQueryUrl: string;
  quote: {
    text: string;
    speaker: string;
  };
  metrics: {
    primary: string;
    secondary: string;
  };
}

export const ICONIC_MOMENTS: IconicMoment[] = [
  {
    id: 'ronaldinho-piggyback',
    title: 'The First Senior Goal & Ronaldinho Piggyback',
    subtitle: 'A sweet lob and a coronation from the king of Camp Nou.',
    category: 'celebration',
    year: 2005,
    date: 'May 1, 2005',
    opponent: 'Albacete Balompié',
    competition: 'La Liga (Round 34)',
    venue: 'Camp Nou, Barcelona',
    description: 'Subbed on in the 88th minute, 17-year-old Messi had a first lobbed goal wrongly ruled out for offside. Unfazed, two minutes later Ronaldinho scooped another delicate ball over the defense. Messi let it bounce once and lofted a velvet lob over goalkeeper Raúl Valbuena, then sprinted straight to Ronaldinho, leaping onto his back in sheer teenage joy.',
    tacticalAnalysis: 'Exemplified Messi’s supreme spatial composure: rather than rushing with his laces, he cushioned a delicate half-volley lob with 0.4 seconds of reaction time.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+first+goal+albacete+ronaldinho',
    quote: {
      text: 'I knew from the very first session he was going to be better than me. I made sure to give him his first assist.',
      speaker: 'Ronaldinho Gaucho'
    },
    metrics: {
      primary: 'Age 17y 311d',
      secondary: 'Goal #1 of 672 for Barca'
    }
  },
  {
    id: 'ankara-messi',
    title: 'The "Ankara Messi" Marathon Wondergoal',
    subtitle: 'A carbon copy of Maradona’s 1986 Goal of the Century.',
    category: 'goal',
    year: 2007,
    date: 'April 18, 2007',
    opponent: 'Getafe CF',
    competition: 'Copa del Rey Semi-Final',
    venue: 'Camp Nou, Barcelona',
    description: 'Receiving the ball inside his own half near the right touchline, 19-year-old Messi executed a nutmeg turn away from two midfielders, embarked on a blistering 55-meter sprint, sliced between two center-backs, feinted past goalkeeper Luis García, and clipped the ball into the net from a tight angle with his weaker right foot.',
    tacticalAnalysis: 'Covered 55.3 meters in 11.2 seconds, making 13 touches on the ball while keeping an average sprint speed of 24.8 km/h under physical pressure.',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+getafe+goal+maradona+copa+del+rey',
    quote: {
      text: 'Ankara Messi! Ankara Messi! Ankara Messi! Gol gol gol gol gol! Encara Messi, todavía Messi! Immens Messi!',
      speaker: 'Joaquim Maria Puyal (Catalan Radio Broadcast)'
    },
    metrics: {
      primary: '55.3 Meters Run',
      secondary: '5 Defenders + Goalkeeper Beaten'
    }
  },
  {
    id: 'rome-header',
    title: 'The Flying Boot Header in Rome',
    subtitle: 'Defying gravity and Edwin van der Sar to secure the 2009 Treble.',
    category: 'goal',
    year: 2009,
    date: 'May 27, 2009',
    opponent: 'Manchester United',
    competition: 'UEFA Champions League Final',
    venue: 'Stadio Olimpico, Rome',
    description: 'In the 70th minute with Barcelona leading 1-0, Xavi curled a tantalizing cross into the penalty box. Messi, at 1.70 meters (5 ft 7 in), timed an astonishing vertical leap behind Rio Ferdinand and looped a backward-arcing header over 6 ft 6 in Edwin van der Sar. As he landed, his right boot flew off, which he scooped up and kissed while wheeling away in celebration.',
    tacticalAnalysis: 'Used Ferdinand’s blind spot to generate momentum, timing his apex jump at 2.45 meters to reach the cross that United’s defense assumed was unplayable.',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+header+rome+2009+manchester+united',
    quote: {
      text: 'It is not a goal I usually score, but it is my personal favorite because of the stage and what it meant for the club.',
      speaker: 'Lionel Messi'
    },
    metrics: {
      primary: '2.45m Apex Leap',
      secondary: 'First Champions League Final Goal'
    }
  },
  {
    id: 'bernabeu-solo-2011',
    title: 'The Bernabéu Solo Slalom vs Real Madrid',
    subtitle: 'Slicing through Mourinho’s Real Madrid in eight breathless seconds.',
    category: 'performance',
    year: 2011,
    date: 'April 27, 2011',
    opponent: 'Real Madrid',
    competition: 'UEFA Champions League Semi-Final',
    venue: 'Santiago Bernabéu, Madrid',
    description: 'With the first leg locked at 1-0 in Madrid, Messi collected a short pass from Sergio Busquets 35 meters out. In an instantaneous burst of acceleration, he blew past Lassana Diarra, evaded Xabi Alonso’s sliding tackle, turned Sergio Ramos inside out, left Raúl Albiol grasping at air, and slid a pinpoint right-footed finish across Iker Casillas into the far corner.',
    tacticalAnalysis: 'Busquets simply placed his foot on the ball and stood still, serving as a human anchor while Messi used pure acceleration and directional feints to dismantle four Madrid lines.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+solo+goal+real+madrid+bernabeu+2011',
    quote: {
      text: 'Here he is again, here he is again! That’s astonishing, absolutely world-class! A near supernatural solo goal!',
      speaker: 'Peter Drury (Commentary)'
    },
    metrics: {
      primary: '8 Seconds / 4 Defenders',
      secondary: 'Champions League Semi-Final Masterclass'
    }
  },
  {
    id: 'record-91-goals',
    title: 'The 91st Goal: Breaking Gerd Müller’s 40-Year Record',
    subtitle: 'Rewriting football arithmetic in Valladolid.',
    category: 'performance',
    year: 2012,
    date: 'December 22, 2012',
    opponent: 'Real Valladolid',
    competition: 'La Liga (Round 17)',
    venue: 'Estadio José Zorrilla, Valladolid',
    description: 'In the 59th minute, Messi received the ball outside the box, pushed past two defenders with a trademark shoulder drop, and placed a clinical low shot in off the post. It was his 91st goal of the calendar year across 69 matches, breaking Gerd Müller’s mythical 1972 record of 85 goals by six strikes.',
    tacticalAnalysis: 'Averaged 1.32 goals per game across all official fixtures in 2012, scoring against 37 different opponents and bagging 22 braces, 9 hat-tricks, 2 four-goal hauls, and 1 five-goal match.',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+91+goals+2012+all+goals',
    quote: {
      text: 'He broke my record, but he is a giant. A genius of our time.',
      speaker: 'Gerd Müller'
    },
    metrics: {
      primary: '91 Goals in 69 Games',
      secondary: 'Guinness World Record'
    }
  },
  {
    id: 'boateng-chip-neuer',
    title: 'The Boateng Drop & Chipping Neuer',
    subtitle: 'Turning the world champion center-back into a viral meme at Camp Nou.',
    category: 'goal',
    year: 2015,
    date: 'May 6, 2015',
    opponent: 'Bayern Munich',
    competition: 'UEFA Champions League Semi-Final',
    venue: 'Camp Nou, Barcelona',
    description: 'With Barcelona leading 1-0 in the 80th minute, Rakitić fed Messi on the right edge of the box. Facing Jerome Boateng, Messi feinted to cut inside onto his left, then snapped instantaneously back to his right. Boateng collapsed backwards to the grass. As Manuel Neuer rushed out with arms spread, Messi delivered a delicate dinked scoop over the German goalkeeper into the net.',
    tacticalAnalysis: 'Calculated Neuer’s sprawling posture: knowing Neuer stays upright until the final microsecond, Messi used a 2-foot chip with zero backlift to leave the 6 ft 4 in goalkeeper helpless.',
    imageUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+boateng+chip+neuer+bayern+munich+2015',
    quote: {
      text: 'He took his soul, he really did! Pure footballing poetry. Jerome Boateng fell like a tree falling in a forest!',
      speaker: 'Martin Tyler & Gary Neville'
    },
    metrics: {
      primary: '0.3s Direction Shift',
      secondary: 'Named UCL Goal of the Decade'
    }
  },
  {
    id: 'bernabeu-shirt-500',
    title: 'The 500th Goal Shirt Display at the Bernabéu',
    subtitle: '92nd minute Clásico winner and an iconic demonstration of supremacy.',
    category: 'celebration',
    year: 2017,
    date: 'April 23, 2017',
    opponent: 'Real Madrid',
    competition: 'La Liga (Round 33)',
    venue: 'Santiago Bernabéu, Madrid',
    description: 'Bloodied with gauze in his mouth from a first-half elbow, Messi endured relentless tactical fouling. With the match poised at 2-2 in the 92nd minute, Sergi Roberto launched a counter-attack and Jordi Alba cut the ball back to the edge of the area. First-time, Messi swept a precision laser inside Keylor Navas’ near post for his 500th official Barcelona goal. He ran to the corner, took off his #10 jersey, and held it aloft before 80,000 Madrid fans.',
    tacticalAnalysis: 'Subtle deceleration: while Real Madrid’s defense sprinted into the 6-yard box to track Suárez, Messi dragged his run to create an 8-meter pocket of uncontested space at the top of the box.',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+shirt+celebration+real+madrid+500+goal',
    quote: {
      text: 'Lionel Messi does it again! The man who is the best in the world, and possibly the history of the game! He lifts his shirt, and says: Remember my name!',
      speaker: 'Rob Palmer (Sky Sports)'
    },
    metrics: {
      primary: '92nd Minute Winner',
      secondary: '500th Official FC Barcelona Goal'
    }
  },
  {
    id: 'maracana-2021',
    title: 'The Maracanã Redemption: Copa América Champion',
    subtitle: 'The 28-year national curse shattered on Brazilian soil.',
    category: 'trophy',
    year: 2021,
    date: 'July 10, 2021',
    opponent: 'Brazil',
    competition: 'Copa América Final',
    venue: 'Maracanã Stadium, Rio de Janeiro',
    description: 'After four painful final defeats, Messi led Argentina into Rio de Janeiro’s historic Maracanã. Ángel Di María scored a 22nd-minute lob, and Argentina fought with ferocity. At the final whistle, Messi dropped to his knees in tears before his teammates swarmed him, hoisting their captain into the air under the Brazilian fireworks.',
    tacticalAnalysis: 'Led tournament across all metrics: 4 goals, 5 assists, 84 duels won, and created 21 big chances, while setting an emotionally selfless tone for the squad.',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+copa+america+2021+maracana+final+celebration',
    quote: {
      text: 'I needed to get this thorn out of my side. I had been close so many times. I thank God for giving me this moment.',
      speaker: 'Lionel Messi'
    },
    metrics: {
      primary: '28-Year Drought Broken',
      secondary: 'Best Player & Golden Boot Winner'
    }
  },
  {
    id: 'lusail-world-cup-2022',
    title: 'The Lusail Crown & The Golden Bisht',
    subtitle: 'Lifting the 18-karat gold FIFA World Cup trophy into eternity.',
    category: 'trophy',
    year: 2022,
    date: 'December 18, 2022',
    opponent: 'France',
    competition: 'FIFA World Cup Final',
    venue: 'Lusail Iconic Stadium, Qatar',
    description: 'In the greatest match in sporting history, Messi scored the opening penalty in the 23rd minute, ignited Di María’s second with a stunning flick, and poked in Argentina’s third in the 108th minute of extra time. After a 3-3 draw and penalty shootout triumph, Messi was draped in the royal black and gold Bisht by the Emir of Qatar, stepped onto the podium, and lifted the World Cup surrounded by confetti.',
    tacticalAnalysis: 'Scored in Round of 16, Quarter-final, Semi-final, and Final—a feat never accomplished by Pelé, Maradona, or any player in 92 years of World Cup history.',
    imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+world+cup+final+trophy+lift+lusail+2022',
    quote: {
      text: 'Lionel Messi has conquered his final peak. Lionel Messi has shaken hands with paradise. The little boy from Rosario has reached the highest heavens of football.',
      speaker: 'Peter Drury'
    },
    metrics: {
      primary: 'World Cup Champion',
      secondary: '2x Golden Ball Winner'
    }
  },
  {
    id: 'miami-freekick-debut',
    title: 'The 94th Minute Free-Kick Debut in Miami',
    subtitle: 'Hollywood script comes to life in Fort Lauderdale.',
    category: 'goal',
    year: 2023,
    date: 'July 21, 2023',
    opponent: 'Cruz Azul',
    competition: 'Leagues Cup (Group Stage)',
    venue: 'Chase Stadium, Fort Lauderdale',
    description: 'Making his Inter Miami debut in front of LeBron James, Kim Kardashian, and David Beckham, the match was deadlocked at 1-1. In the 94th minute, Messi won a free-kick 25 yards out. With the clock ticking past 93:50, he struck a textbook left-footed curler over the wall into the top-left stanchion, sprinting to the corner flag to embrace his children.',
    tacticalAnalysis: 'Achieved an initial ball velocity of 87 km/h with an aggressive 32-degree dip, giving Cruz Azul goalkeeper Andrés Gudiño zero reaction window.',
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80',
    videoQueryUrl: 'https://www.youtube.com/results?search_query=messi+inter+miami+debut+free+kick+cruz+azul',
    quote: {
      text: 'I knew I had to score. It was the last play of the game and I wanted to start this new journey with a win for these fans.',
      speaker: 'Lionel Messi'
    },
    metrics: {
      primary: '94th Minute Winner',
      secondary: '65th Career Free-Kick Goal'
    }
  }
];

export const ICONIC_GOALS_TACTICAL: IconicGoal[] = [
  {
    id: 'goal-getafe-2007',
    title: 'The Getafe Marathon',
    subtitle: '55-meter Maradona recreation',
    date: 'April 18, 2007',
    competition: 'Copa del Rey',
    opponent: 'Getafe',
    team: 'FC Barcelona',
    minute: '28’',
    type: 'Solo Dribble',
    distanceMeters: 55,
    speedKmh: 28.5,
    pitchTrajectory: {
      startX: 45,
      startY: 85,
      dribblePoints: [
        { x: 52, y: 75, label: 'Nutmeg Turn' },
        { x: 65, y: 65, label: 'Sprint Past Nacho' },
        { x: 78, y: 55, label: 'Split Center-Backs' },
        { x: 88, y: 48, label: 'Round Goalkeeper' }
      ],
      shotTarget: { x: 99, y: 45 },
      assistPlayer: 'Xavi Hernández'
    },
    commentarySnippet: 'Ankara Messi! Ankara Messi! Immens Messi! Encara Messi! Gol gol gol gol gol!',
    commentator: 'Joaquim Maria Puyal',
    context: 'At age 19, stunned the planet by replicating Diego Maradona’s 1986 goal against England down to touch count and angle.',
    significance: 'Voted by Barcelona fans as the greatest goal in the club’s 125-year history.'
  },
  {
    id: 'goal-bernabeu-2011',
    title: 'Bernabéu UCL Solo Slalom',
    subtitle: 'Destroying Real Madrid’s blockade in 8 seconds',
    date: 'April 27, 2011',
    competition: 'UEFA Champions League Semi-Final',
    opponent: 'Real Madrid',
    team: 'FC Barcelona',
    minute: '87’',
    type: 'Solo Dribble',
    distanceMeters: 38,
    speedKmh: 27.2,
    pitchTrajectory: {
      startX: 62,
      startY: 52,
      dribblePoints: [
        { x: 68, y: 54, label: 'Bypass Diarra' },
        { x: 75, y: 58, label: 'Cut Inside Ramos' },
        { x: 84, y: 55, label: 'Beat Albiol' },
        { x: 92, y: 53, label: 'Casillas Slide-in' }
      ],
      shotTarget: { x: 99, y: 46 },
      assistPlayer: 'Sergio Busquets'
    },
    commentarySnippet: 'Away from two, three, four! Wonderful, wonderful, wonderful! How does he do it?!',
    commentator: 'Clive Tyldesley',
    context: 'In an intensely toxic El Clásico semi-final against Mourinho’s Madrid, broke the tie with pure individual magic.',
    significance: 'Secured passage to the Wembley Final and cemented the 2011 team’s status as football royalty.'
  },
  {
    id: 'goal-boateng-2015',
    title: 'The Boateng Drop & Neuer Chip',
    subtitle: 'Gravitational surrender in the Champions League',
    date: 'May 6, 2015',
    competition: 'UEFA Champions League Semi-Final',
    opponent: 'Bayern Munich',
    team: 'FC Barcelona',
    minute: '80’',
    type: 'Precision Chip',
    distanceMeters: 14,
    speedKmh: 19.4,
    pitchTrajectory: {
      startX: 78,
      startY: 72,
      dribblePoints: [
        { x: 84, y: 68, label: 'Body Feint Inside' },
        { x: 88, y: 60, label: 'Snap Right / Boateng Drops' },
        { x: 92, y: 54, label: 'Dink Over Neuer' }
      ],
      shotTarget: { x: 99, y: 51 },
      assistPlayer: 'Ivan Rakitić'
    },
    commentarySnippet: 'Here he is again... Here he is again! That’s astonishing, absolutely world class!',
    commentator: 'Martin Tyler',
    context: 'Pep Guardiola returned to Camp Nou as Bayern coach; Messi struck twice in 3 minutes to shatter the German champions.',
    significance: 'UEFA Goal of the Season and one of the most culturally viewed sporting clips in internet history.'
  },
  {
    id: 'goal-bilbao-2015',
    title: 'The Touchline Solo vs Athletic Club',
    subtitle: 'Trapped against the sideline, beats four and scores near-post',
    date: 'May 30, 2015',
    competition: 'Copa del Rey Final',
    opponent: 'Athletic Bilbao',
    team: 'FC Barcelona',
    minute: '20’',
    type: 'Solo Dribble',
    distanceMeters: 50,
    speedKmh: 31.2,
    pitchTrajectory: {
      startX: 50,
      startY: 92,
      dribblePoints: [
        { x: 60, y: 94, label: 'Nutmeg on Balenziaga' },
        { x: 70, y: 90, label: 'Tightrope Sideline Sprint' },
        { x: 82, y: 78, label: 'Cut Between 3 Defenders' },
        { x: 90, y: 60, label: 'Near-Post Strike' }
      ],
      shotTarget: { x: 99, y: 56 },
      assistPlayer: 'Dani Alves'
    },
    commentarySnippet: 'Magisterial Lionel Messi! He could make an onion cry!',
    commentator: 'Ray Hudson',
    context: 'Surrounded by three defenders pinned against the right touchline with less than 2 meters of space.',
    significance: 'Nominated for the FIFA Puskás Award; opened the scoring in Barcelona’s 2015 Treble-clinching cup final.'
  },
  {
    id: 'goal-world-cup-final-2022',
    title: 'The 108th Minute World Cup Final Strike',
    subtitle: 'Extra-time tap-in that crossed the line in Lusail',
    date: 'December 18, 2022',
    competition: 'FIFA World Cup Final',
    opponent: 'France',
    team: 'Argentina',
    minute: '108’',
    type: 'Clutch Winner',
    distanceMeters: 4,
    speedKmh: 14.0,
    pitchTrajectory: {
      startX: 70,
      startY: 50,
      dribblePoints: [
        { x: 80, y: 52, label: 'Flick to Lautaro' },
        { x: 90, y: 48, label: 'Box Crash' },
        { x: 95, y: 50, label: 'Right-Foot Rebound' }
      ],
      shotTarget: { x: 99, y: 50 },
      assistPlayer: 'Lautaro Martínez'
    },
    commentarySnippet: 'It is in! Upamecano clears, but the referee indicates goal! Messi has scored again!',
    commentator: 'Peter Drury',
    context: 'Locked at 2-2 in extra time against defending world champions France, Messi reacted fastest to Lautaro’s rebound.',
    significance: 'His 13th World Cup goal and 7th of the tournament, cementing the greatest World Cup final victory.'
  },
  {
    id: 'goal-cruz-azul-2023',
    title: 'The Miami Debut Free-Kick Laser',
    subtitle: '94th minute curling majesty in front of world icons',
    date: 'July 21, 2023',
    competition: 'Leagues Cup',
    opponent: 'Cruz Azul',
    team: 'Inter Miami',
    minute: '94’',
    type: 'Long Range Free-Kick',
    distanceMeters: 26,
    speedKmh: 87.0,
    pitchTrajectory: {
      startX: 76,
      startY: 42,
      dribblePoints: [
        { x: 82, y: 44, label: 'Wall Clearance' },
        { x: 90, y: 48, label: 'Aggressive 32° Dip' }
      ],
      shotTarget: { x: 99, y: 54 },
      assistPlayer: 'Self (Foul Won)'
    },
    commentarySnippet: 'Lionel Messi in stoppage time... HE’S DONE IT! THE GREATEST OF ALL TIME DOES IT AGAIN!',
    commentator: 'MLS Season Pass Broadcast',
    context: 'His first competitive match on North American soil; entered the pitch in the 54th minute.',
    significance: 'Ignited Inter Miami’s fairytale run to their first major silverware in club history.'
  }
];

export const LEGEND_QUOTES: LegendQuote[] = [
  {
    id: 'pep-1',
    quote: 'Don’t write about him, don’t try to describe him. Just watch him.',
    speaker: 'Pep Guardiola',
    role: 'Former Manager, FC Barcelona & Manchester City',
    category: 'managers'
  },
  {
    id: 'maradona-1',
    quote: 'I have seen the player who will inherit my place in Argentine football and his name is Messi.',
    speaker: 'Diego Armando Maradona',
    role: 'Argentine Icon & 1986 World Cup Champion',
    category: 'legends',
    year: '2006'
  },
  {
    id: 'wenger-1',
    quote: 'Messi is like a PlayStation. He can take advantage of every mistake you make.',
    speaker: 'Arsène Wenger',
    role: 'Legendary Arsenal Manager',
    category: 'managers'
  },
  {
    id: 'buffon-1',
    quote: 'When I touched his head after the final whistle to see if he was really human, he looked at me and smiled.',
    speaker: 'Gianluigi Buffon',
    role: 'World Cup Champion & Legendary Goalkeeper',
    category: 'rivals'
  },
  {
    id: 'klopp-1',
    quote: 'My father always told me Pelé was the greatest, but for me, Lionel Messi is the greatest player I have ever seen in my life.',
    speaker: 'Jürgen Klopp',
    role: 'Former Liverpool Manager',
    category: 'managers'
  },
  {
    id: 'zlatan-1',
    quote: 'Messi does not need his right foot. He only uses the left and he’s still the best in the world. Imagine if he also used his right, we would all be in trouble.',
    speaker: 'Zlatan Ibrahimović',
    role: 'Former Teammate & Swedish Legend',
    category: 'teammates'
  },
  {
    id: 'ferguson-1',
    quote: 'No one has given us a hiding like that. In my time as manager, he is without question the best player we have ever faced.',
    speaker: 'Sir Alex Ferguson',
    role: 'Legendary Manchester United Manager (after Wembley 2011)',
    category: 'managers',
    year: '2011'
  },
  {
    id: 'pele-1',
    quote: 'I like Messi a lot, he’s a great player. Technically we are practically at the same level. He is a magician.',
    speaker: 'Pelé',
    role: '3-time World Cup Champion',
    category: 'legends'
  },
  {
    id: 'henry-1',
    quote: 'Sometimes you see a goal on TV and you say that’s impossible. Messi does things on the training pitch every Tuesday that make your jaw drop.',
    speaker: 'Thierry Henry',
    role: 'Former Teammate & Arsenal Legend',
    category: 'teammates'
  },
  {
    id: 'beckham-1',
    quote: 'He plays with freedom, he loves the game, and he makes everyone around him believe that anything is possible.',
    speaker: 'David Beckham',
    role: 'Inter Miami Co-Owner & England Legend',
    category: 'legends'
  }
];

export const TRIVIA_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'On what everyday household object was Lionel Messi’s first Barcelona contract written in December 2000?',
    options: ['A paper napkin', 'A restaurant coaster', 'A matchday ticket', 'A hospital prescription'],
    correctIndex: 0,
    explanation: 'Barcelona scout Charly Rexach was so desperate not to lose Messi that he drafted the agreement on a paper napkin at the Pompeia tennis club in Barcelona.',
    category: 'early_life'
  },
  {
    id: 2,
    question: 'How many goals did Lionel Messi score in the 2012 calendar year to set the Guinness World Record?',
    options: ['85 goals', '91 goals', '79 goals', '95 goals'],
    correctIndex: 1,
    explanation: 'Messi scored 91 goals in 69 matches in 2012 (79 for Barcelona and 12 for Argentina), breaking Gerd Müller’s 1972 record of 85 goals.',
    category: 'records'
  },
  {
    id: 3,
    question: 'Which legendary Brazilian teammate provided the lofted assist for Messi’s first senior goal against Albacete in 2005?',
    options: ['Rivaldo', 'Ronaldinho', 'Deco', 'Ronaldo Nazário'],
    correctIndex: 1,
    explanation: 'Ronaldinho chipped the ball over the Albacete defense for Messi to lob the keeper, leading to the famous piggyback celebration.',
    category: 'barcelona'
  },
  {
    id: 4,
    question: 'In the 2022 FIFA World Cup in Qatar, in which knockout stage rounds did Lionel Messi score?',
    options: [
      'Only the Semi-final and Final',
      'Round of 16, Quarter-final, Semi-final, and Final',
      'Group Stage and Final only',
      'Quarter-final and Final only'
    ],
    correctIndex: 1,
    explanation: 'Messi became the first player in World Cup history to score in every single knockout round: Australia (R16), Netherlands (QF), Croatia (SF), and twice vs France in the Final.',
    category: 'world_cup'
  },
  {
    id: 5,
    question: 'How many official Ballon d’Or trophies has Lionel Messi won across his career?',
    options: ['5', '6', '7', '8'],
    correctIndex: 3,
    explanation: 'Messi has won an all-time record 8 Ballons d’Or (2009, 2010, 2011, 2012, 2015, 2019, 2021, and 2023).',
    category: 'records'
  },
  {
    id: 6,
    question: 'To whom does Lionel Messi dedicate every single goal when he points his index fingers toward the sky?',
    options: ['His childhood coach', 'His grandmother Celia', 'Diego Maradona', 'His mother'],
    correctIndex: 1,
    explanation: 'Messi always points to the heavens to honor his maternal grandmother Celia, who was the first person to encourage him to play football and passed away in 1998.',
    category: 'early_life'
  },
  {
    id: 7,
    question: 'Against which club did Messi score his 500th Barcelona goal before holding his shirt up to the stadium crowd?',
    options: ['Atlético Madrid', 'Bayern Munich', 'Real Madrid', 'Valencia'],
    correctIndex: 2,
    explanation: 'In April 2017, Messi scored a 92nd-minute stoppage-time winner at the Santiago Bernabéu against Real Madrid and displayed his #10 jersey.',
    category: 'barcelona'
  },
  {
    id: 8,
    question: 'With 46 team trophies won, what distinction does Lionel Messi hold in world football history?',
    options: [
      'Second most decorated behind Dani Alves',
      'Most decorated player in association football history',
      'Tied for first with Cristiano Ronaldo',
      'Most decorated Argentine but third overall'
    ],
    correctIndex: 1,
    explanation: 'With the 2024 Supporters’ Shield and 2024 Copa América, Messi reached 46 official trophies, surpassing Dani Alves (44) to become the single most decorated footballer in world history.',
    category: 'records'
  }
];
