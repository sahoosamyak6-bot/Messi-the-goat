import React, { useState, useMemo } from 'react';
import {
  SEASON_BY_SEASON_STATS,
  CLUB_COUNTRY_TOTALS,
  COMPETITION_BREAKDOWN,
  SeasonStatDetail,
} from '../data/messi-data';
import { BarChart3, Search, ArrowUpDown, Shield, Globe, Award, Filter } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { normalizeSeasonSearch } from '../utils/stats-calculator';

interface CareerStatsProps {
  externalSeasonQuery?: string;
  externalRequestKey?: number;
  onClearExternalSeason?: () => void;
}

export const CareerStats: React.FC<CareerStatsProps> = ({
  externalSeasonQuery,
  externalRequestKey,
  onClearExternalSeason,
}) => {
  const [activeTab, setActiveTab] = useState<'seasons' | 'clubs' | 'competitions'>('seasons');
  const [clubFilter, setClubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'season' | 'totalGoals' | 'totalAssists' | 'totalApps'>('season');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  React.useEffect(() => {
    if (externalSeasonQuery) {
      setSearchQuery(externalSeasonQuery);
      setActiveTab('seasons');
    }
  }, [externalSeasonQuery, externalRequestKey]);

  // Filtered & sorted seasons
  const filteredSeasons = useMemo(() => {
    let result = [...SEASON_BY_SEASON_STATS];

    if (clubFilter !== 'all') {
      result = result.filter((s) => s.club.toLowerCase().includes(clubFilter.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = normalizeSeasonSearch(searchQuery);
      result = result.filter(
        (s) =>
          normalizeSeasonSearch(s.season).includes(q) ||
          normalizeSeasonSearch(s.club).includes(q) ||
          s.trophies.some((t) => normalizeSeasonSearch(t).includes(q))
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
    <section id="statistics" className="archive-content py-20 bg-sky-50/60 border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-sky-700 uppercase mb-3">
            <BarChart3 className="w-4 h-4 text-sky-700 inline" />
            <span>Official Statistical Database</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-slate-950">
            Career Records & Numbers
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
            Detailed statistical compilation across 21 seasons, covering senior clubs (FC Barcelona, Paris Saint-Germain, Inter Miami CF) and the Argentina National Team.
          </p>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-sky-100">
          <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-lg border border-sky-100">
            <button
              type="button"
              onClick={() => {
                soundFx.playClickTone();
                setActiveTab('seasons');
              }}
              aria-pressed={activeTab === 'seasons'}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'seasons'
                  ? 'bg-[#154284] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
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
              aria-pressed={activeTab === 'clubs'}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'clubs'
                  ? 'bg-[#154284] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
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
              aria-pressed={activeTab === 'competitions'}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'competitions'
                  ? 'bg-[#154284] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Major Competitions
            </button>
          </div>

          {/* Quick Counter for filtered seasons */}
          {activeTab === 'seasons' && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-slate-600">
              <div>
                <span className="text-slate-500">Filtered Games: </span>
                <span className="text-slate-950 font-bold">{aggregatedFiltered.apps}</span>
              </div>
              <div>
                <span className="text-slate-500">Goals: </span>
                <span className="text-[#154284] font-bold">{aggregatedFiltered.goals}</span>
              </div>
              <div>
                <span className="text-slate-500">Assists: </span>
                <span className="text-sky-700 font-bold">{aggregatedFiltered.assists}</span>
              </div>
              <div>
                <span className="text-slate-500">G+A: </span>
                <span className="text-emerald-700 font-bold">{aggregatedFiltered.goals + aggregatedFiltered.assists}</span>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: SEASON-BY-SEASON TABLE */}
        {activeTab === 'seasons' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-sky-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
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
                    aria-pressed={clubFilter === c}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      clubFilter === c
                        ? 'bg-sky-100 text-slate-950 font-semibold'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-sky-100'
                    }`}
                  >
                    {c === 'all' ? 'All Teams' : c}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search season, trophy, or club..."
                  aria-label="Search season, trophy, or club"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-sky-50/70 text-xs text-slate-800 placeholder-slate-500 rounded-lg pl-9 pr-8 py-1.5 border border-sky-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      if (onClearExternalSeason) onClearExternalSeason();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-950 text-xs font-mono"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-slate-600 border-b border-sky-100 font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="p-3 cursor-pointer hover:text-[#154284]" onClick={() => handleSort('season')}>
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
                    <th scope="col" className="p-3 cursor-pointer hover:text-[#154284] text-right" onClick={() => handleSort('totalApps')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Apps</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3 cursor-pointer hover:text-[#154284] text-right" onClick={() => handleSort('totalGoals')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Goals</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3 cursor-pointer hover:text-[#154284] text-right" onClick={() => handleSort('totalAssists')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Assists</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th scope="col" className="p-3 text-right">G+A</th>
                    <th scope="col" className="p-3 min-w-[220px]">Honors & Distinctions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 font-mono">
                  {filteredSeasons.map((row) => {
                    const isPeakYear = row.season === '2011-12' || row.season === '2014-15' || row.season === '2022-23';
                    const gaTotal = row.totalGoals + row.totalAssists;
                    return (
                      <tr
                        key={row.season}
                        className={`hover:bg-sky-50/80 transition-colors ${
                          isPeakYear ? 'bg-sky-50/60' : ''
                        }`}
                      >
                        <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                          {row.season}
                          {row.season === '2011-12' && (
                            <span className="ml-1 text-[10px] text-[#154284] font-sans font-bold">★ 82G</span>
                          )}
                          {row.season === '2022-23' && (
                            <span className="ml-1 text-[10px] text-sky-700 font-sans font-bold">★ WC</span>
                          )}
                        </td>
                        <td className="p-3 font-sans text-slate-600 whitespace-nowrap">{row.club}</td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">
                          {row.leagueApps} / <span className="text-slate-800">{row.leagueGoals}</span> / {row.leagueAssists}
                        </td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">
                          {row.continentalApps} / <span className="text-slate-800">{row.continentalGoals}</span> / {row.continentalAssists}
                        </td>
                        <td className="p-3 text-slate-600 whitespace-nowrap">
                          {row.cupApps} / <span className="text-slate-800">{row.cupGoals}</span> / {row.cupAssists}
                        </td>
                        <td className="p-3 text-sky-800 whitespace-nowrap">
                          {row.intlApps} / <span className="text-sky-800 font-bold">{row.intlGoals}</span> / {row.intlAssists}
                        </td>
                        <td className="p-3 text-right font-medium text-slate-600">{row.totalApps}</td>
                        <td className="p-3 text-right font-bold text-[#154284]">{row.totalGoals}</td>
                        <td className="p-3 text-right font-bold text-sky-700">{row.totalAssists}</td>
                        <td className="p-3 text-right font-bold text-emerald-700">{gaTotal}</td>
                        <td className="p-3 font-sans text-xs text-slate-600">
                          {row.trophies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {row.trophies.map((tr, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={`text-[11px] ${
                                    tr.includes('World Cup') || tr.includes('Champions League') || tr.includes('Ballon')
                                      ? 'text-[#154284] font-medium'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  {tr}{tIdx < row.trophies.length - 1 ? ' ·' : ''}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
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
                className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm hover:border-sky-200 transition-all"
              >
                <div className="flex items-center justify-between border-b border-sky-100 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-sans text-slate-950">
                      {team.team}
                    </h3>
                    <span className="text-xs font-mono text-slate-600">{team.period}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#154284] uppercase tracking-wider">Trophies</span>
                    <div className="text-2xl font-bold font-sans text-[#154284]">
                      {team.trophies}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                  <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-100">
                    <div className="text-xs font-mono uppercase text-slate-600">Matches</div>
                    <div className="text-xl font-bold font-sans text-slate-800 mt-1">{team.apps}</div>
                  </div>
                  <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-100">
                    <div className="text-xs font-mono uppercase text-slate-600">Goals</div>
                    <div className="text-xl font-bold font-sans text-[#154284] mt-1">{team.goals}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{team.gpg} / game</div>
                  </div>
                  <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-100">
                    <div className="text-xs font-mono uppercase text-slate-600">Assists</div>
                    <div className="text-xl font-bold font-sans text-sky-700 mt-1">{team.assists}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{team.apg} / game</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#154284]" />
                    Major Honors
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {team.honorsSummary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: COMPETITION BREAKDOWN */}
        {activeTab === 'competitions' && (
          <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50 text-slate-600 border-b border-sky-100 font-mono uppercase tracking-wider text-[11px]">
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
              <tbody className="divide-y divide-sky-100 font-mono">
                {COMPETITION_BREAKDOWN.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-sky-50/80 transition-colors">
                    <td className="p-3 font-sans font-semibold text-slate-800 whitespace-nowrap">
                      {comp.competition}
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-sans ${comp.scope === 'International' ? 'text-sky-700' : 'text-slate-600'}`}>
                        {comp.scope}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-600">{comp.apps}</td>
                    <td className="p-3 text-right font-bold text-[#154284]">{comp.goals}</td>
                    <td className="p-3 text-right font-bold text-sky-700">{comp.assists}</td>
                    <td className="p-3 text-right font-bold text-slate-950">{comp.titles}</td>
                    <td className="p-3 font-sans text-slate-600 text-xs">
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
