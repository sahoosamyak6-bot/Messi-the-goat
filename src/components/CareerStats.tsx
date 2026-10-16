import React, { useState, useMemo } from 'react';
import {
  SEASON_BY_SEASON_STATS,
  CLUB_COUNTRY_TOTALS,
  COMPETITION_BREAKDOWN,
  SeasonStatDetail,
} from '../data/messi-data';
import { BarChart3, Search, ArrowUpDown, Shield, Globe, Award, Filter } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const CareerStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seasons' | 'clubs' | 'competitions'>('seasons');
  const [clubFilter, setClubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'season' | 'totalGoals' | 'totalAssists' | 'totalApps'>('season');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered & sorted seasons
  const filteredSeasons = useMemo(() => {
    let result = [...SEASON_BY_SEASON_STATS];

    if (clubFilter !== 'all') {
      result = result.filter((s) => s.club.toLowerCase().includes(clubFilter.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.season.toLowerCase().includes(q) ||
          s.club.toLowerCase().includes(q) ||
          s.trophies.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortField === 'season') {
        return sortAsc ? a.season.localeCompare(b.season) : b.season.localeCompare(a.season);
      }
      return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    });

    return result;
  }, [clubFilter, searchQuery, sortField, sortAsc]);

  // Aggregate stats for filtered view
  const aggregatedFiltered = useMemo(() => {
    return filteredSeasons.reduce(
      (acc, s) => {
        acc.apps += s.totalApps;
        acc.goals += s.totalGoals;
        acc.assists += s.totalAssists;
        return acc;
      },
      { apps: 0, goals: 0, assists: 0 }
    );
  }, [filteredSeasons]);

  const handleSort = (field: 'season' | 'totalGoals' | 'totalAssists' | 'totalApps') => {
    soundFx.playClickTone();
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="statistics" className="py-20 bg-[#060a10] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase mb-3">
            <BarChart3 className="w-4 h-4 text-sky-400 inline" />
            <span>Official Statistical Database</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-prestige tracking-tight text-white uppercase">
            Career Records & Numbers
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Detailed statistical compilation across 21 seasons, covering senior clubs (FC Barcelona, Paris Saint-Germain, Inter Miami CF) and the Argentina National Team.
          </p>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 bg-[#090e18] p-1 rounded border border-slate-800">
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setActiveTab('seasons');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                activeTab === 'seasons'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Season-by-Season (2004–2025)
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setActiveTab('clubs');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                activeTab === 'clubs'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clubs & Argentina Totals
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setActiveTab('competitions');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                activeTab === 'competitions'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Major Competitions
            </button>
          </div>

          {/* Quick Counter for filtered seasons */}
          {activeTab === 'seasons' && (
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500">Filtered Games: </span>
                <span className="text-white font-bold">{aggregatedFiltered.apps}</span>
              </div>
              <div>
                <span className="text-slate-500">Goals: </span>
                <span className="text-amber-400 font-bold">{aggregatedFiltered.goals}</span>
              </div>
              <div>
                <span className="text-slate-500">Assists: </span>
                <span className="text-sky-400 font-bold">{aggregatedFiltered.assists}</span>
              </div>
              <div>
                <span className="text-slate-500">G+A: </span>
                <span className="text-emerald-400 font-bold">{aggregatedFiltered.goals + aggregatedFiltered.assists}</span>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: SEASON-BY-SEASON TABLE */}
        {activeTab === 'seasons' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0a0f19] p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filter Club:
                </span>
                {['all', 'Barcelona', 'Paris', 'Miami'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      soundFx.playClickTone();
                      setClubFilter(c);
                    }}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      clubFilter === c
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {c === 'all' ? 'All Teams' : c}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search season, trophy, or club..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#080d16] text-xs text-slate-200 placeholder-slate-500 rounded pl-9 pr-3 py-1.5 border border-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                />
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#080c14]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c121d] text-slate-300 border-b border-slate-800 font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="p-3 cursor-pointer hover:text-amber-400" onClick={() => handleSort('season')}>
                      <div className="flex items-center gap-1">
                        <span>Season</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3">Club</th>
                    <th scope="col" className="p-3">League (A/G/A)</th>
                    <th scope="col" className="p-3">Continental (A/G/A)</th>
                    <th scope="col" className="p-3">Cups (A/G/A)</th>
                    <th scope="col" className="p-3">Argentina (A/G/A)</th>
                    <th scope="col" className="p-3 cursor-pointer hover:text-amber-400 text-right" onClick={() => handleSort('totalApps')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Apps</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3 cursor-pointer hover:text-amber-400 text-right" onClick={() => handleSort('totalGoals')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Goals</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3 cursor-pointer hover:text-amber-400 text-right" onClick={() => handleSort('totalAssists')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Assists</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3 text-right">G+A</th>
                    <th scope="col" className="p-3 min-w-[220px]">Honors & Distinctions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredSeasons.map((row) => {
                    const isPeakYear = row.season === '2011-12' || row.season === '2014-15' || row.season === '2022-23';
                    const gaTotal = row.totalGoals + row.totalAssists;
                    return (
                      <tr
                        key={row.season}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isPeakYear ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        <td className="p-3 font-semibold text-slate-200 whitespace-nowrap">
                          {row.season}
                          {row.season === '2011-12' && (
                            <span className="ml-1 text-[10px] text-amber-400 font-sans font-bold">★ 82G</span>
                          )}
                          {row.season === '2022-23' && (
                            <span className="ml-1 text-[10px] text-sky-400 font-sans font-bold">★ WC</span>
                          )}
                        </td>
                        <td className="p-3 font-sans text-slate-300 whitespace-nowrap">{row.club}</td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">
                          {row.leagueApps} / <span className="text-slate-200">{row.leagueGoals}</span> / {row.leagueAssists}
                        </td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">
                          {row.continentalApps} / <span className="text-slate-200">{row.continentalGoals}</span> / {row.continentalAssists}
                        </td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">
                          {row.cupApps} / <span className="text-slate-200">{row.cupGoals}</span> / {row.cupAssists}
                        </td>
                        <td className="p-3 text-sky-300/80 whitespace-nowrap">
                          {row.intlApps} / <span className="text-sky-300 font-bold">{row.intlGoals}</span> / {row.intlAssists}
                        </td>
                        <td className="p-3 text-right font-medium text-slate-300">{row.totalApps}</td>
                        <td className="p-3 text-right font-bold text-amber-400">{row.totalGoals}</td>
                        <td className="p-3 text-right font-bold text-sky-400">{row.totalAssists}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">{gaTotal}</td>
                        <td className="p-3 font-sans text-xs text-slate-400">
                          {row.trophies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {row.trophies.map((tr, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={`text-[11px] ${
                                    tr.includes('World Cup') || tr.includes('Champions League') || tr.includes('Ballon')
                                      ? 'text-amber-300 font-medium'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {tr}{tIdx < row.trophies.length - 1 ? ' ·' : ''}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CLUBS & COUNTRY TOTALS CARDS */}
        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLUB_COUNTRY_TOTALS.map((team, idx) => (
              <div
                key={idx}
                className="bg-[#090e18] p-6 rounded-lg border border-slate-800 shadow-sm hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-serif-prestige text-white">
                      {team.team}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">{team.period}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Trophies</span>
                    <div className="text-2xl font-bold font-serif-prestige text-amber-400">
                      {team.trophies}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-800/80">
                    <div className="text-xs font-mono uppercase text-slate-400">Matches</div>
                    <div className="text-xl font-bold font-serif-prestige text-slate-200 mt-1">{team.apps}</div>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-800/80">
                    <div className="text-xs font-mono uppercase text-slate-400">Goals</div>
                    <div className="text-xl font-bold font-serif-prestige text-amber-400 mt-1">{team.goals}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{team.gpg} / game</div>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-800/80">
                    <div className="text-xs font-mono uppercase text-slate-400">Assists</div>
                    <div className="text-xl font-bold font-serif-prestige text-sky-400 mt-1">{team.assists}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{team.apg} / game</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Major Honors
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {team.honorsSummary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: COMPETITION BREAKDOWN */}
        {activeTab === 'competitions' && (
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#080c14]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c121d] text-slate-300 border-b border-slate-800 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th scope="col" className="p-3">Tournament / Competition</th>
                  <th scope="col" className="p-3">Scope</th>
                  <th scope="col" className="p-3 text-right">Appearances</th>
                  <th scope="col" className="p-3 text-right">Goals</th>
                  <th scope="col" className="p-3 text-right">Assists</th>
                  <th scope="col" className="p-3 text-right">Titles Won</th>
                  <th scope="col" className="p-3">Notable Record / Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {COMPETITION_BREAKDOWN.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans font-semibold text-slate-200 whitespace-nowrap">
                      {comp.competition}
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-sans ${comp.scope === 'International' ? 'text-sky-400' : 'text-slate-400'}`}>
                        {comp.scope}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-300">{comp.apps}</td>
                    <td className="p-3 text-right font-bold text-amber-400">{comp.goals}</td>
                    <td className="p-3 text-right font-bold text-sky-400">{comp.assists}</td>
                    <td className="p-3 text-right font-bold text-white">{comp.titles}</td>
                    <td className="p-3 font-sans text-slate-300 text-xs">
                      {comp.notableRecord}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
